use git2::{Repository, StatusOptions};
use crate::models::{RepositoryInfo, GitChange, FileDiff, Hunk};
use std::path::Path;

pub fn analyze_repo(path: &Path) -> Result<RepositoryInfo, Box<dyn std::error::Error>> {
    let repo = Repository::open(path)?;
    
    let name = path.file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();

    let remote_url = repo.find_remote("origin")
        .ok()
        .and_then(|r| r.url().map(|u| u.to_string()));

    let head = repo.head().ok();
    let current_branch = head.as_ref()
        .and_then(|h| h.shorthand())
        .unwrap_or("HEAD")
        .to_string();

    let mut local_branches = Vec::new();
    if let Ok(branches) = repo.branches(Some(git2::BranchType::Local)) {
        for branch in branches {
            if let Ok((branch, _)) = branch {
                if let Ok(Some(name)) = branch.name() {
                    local_branches.push(name.to_string());
                }
            }
        }
    }

    let mut status_options = git2::StatusOptions::new();
    status_options.include_untracked(true);
    let statuses = repo.statuses(Some(&mut status_options))?;
    let is_dirty = !statuses.is_empty();

    // Check for unpushed commits
    let mut has_unpushed_commits = false;
    if let Some(head) = head {
        if let Some(local_oid) = head.target() {
            if let Ok(branch) = repo.find_branch(&current_branch, git2::BranchType::Local) {
                if let Ok(upstream) = branch.upstream() {
                    if let Some(upstream_oid) = upstream.get().target() {
                        if let Ok((ahead, _)) = repo.graph_ahead_behind(local_oid, upstream_oid) {
                            has_unpushed_commits = ahead > 0;
                        }
                    }
                }
            }
        }
    }

    Ok(RepositoryInfo {
        name,
        path: path.to_string_lossy().to_string(),
        remote_url,
        current_branch,
        local_branches,
        is_dirty,
        has_unpushed_commits,
    })
}

pub fn commit_all(path: &Path, message: &str) -> Result<(), Box<dyn std::error::Error>> {
    let repo = Repository::open(path)?;
    let mut index = repo.index()?;
    index.add_all(["*"].iter(), git2::IndexAddOption::DEFAULT, None)?;
    index.write()?;
    
    let tree_id = index.write_tree()?;
    let tree = repo.find_tree(tree_id)?;
    
    let signature = repo.signature()?;
    let parent_commit = repo.head()?.peel_to_commit()?;
    
    repo.commit(
        Some("HEAD"),
        &signature,
        &signature,
        message,
        &tree,
        &[&parent_commit],
    )?;
    
    Ok(())
}

pub fn push_repo(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let repo = Repository::open(path)?;
    let mut remote = repo.find_remote("origin")?;
    let head = repo.head()?;
    let branch_name = head.shorthand().ok_or("Invalid branch name")?;
    
    // Note: This requires credentials which is tricky in a GUI without a prompt.
    // We'll use the default callbacks for now.
    let callbacks = git2::RemoteCallbacks::new();
    // In a real app, you'd handle credentials here.
    
    let mut options = git2::PushOptions::new();
    options.remote_callbacks(callbacks);
    
    remote.push(&[format!("refs/heads/{}:refs/heads/{}", branch_name, branch_name)], Some(&mut options))?;
    
    Ok(())
}

pub fn safe_delete(path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let repo_info = analyze_repo(path)?;
    if repo_info.is_dirty || repo_info.has_unpushed_commits {
        return Err("Cannot delete repo with uncommitted changes or unpushed commits".into());
    }
    
    std::fs::remove_dir_all(path)?;
    Ok(())
}

pub fn get_repo_changes(path: &Path) -> Result<Vec<GitChange>, Box<dyn std::error::Error>> {
    let repo = Repository::open(path)?;
    let mut status_options = StatusOptions::new();
    status_options.include_untracked(true);
    let statuses = repo.statuses(Some(&mut status_options))?;

    let mut changes = Vec::new();
    for entry in statuses.iter() {
        if let Some(path) = entry.path() {
            let status_flags = entry.status();
            let mut status_str = "unknown";
            
            if status_flags.contains(git2::Status::WT_NEW) || status_flags.contains(git2::Status::INDEX_NEW) {
                status_str = "added";
            } else if status_flags.contains(git2::Status::WT_DELETED) || status_flags.contains(git2::Status::INDEX_DELETED) {
                status_str = "deleted";
            } else if status_flags.contains(git2::Status::WT_MODIFIED) || status_flags.contains(git2::Status::INDEX_MODIFIED) {
                status_str = "modified";
            }
            
            changes.push(GitChange {
                path: path.to_string(),
                status: status_str.to_string(),
            });
        }
    }
    Ok(changes)
}

pub fn get_file_diff_content(repo_path: &Path, file_path: &str) -> Result<FileDiff, Box<dyn std::error::Error>> {
    let repo = Repository::open(repo_path)?;
    
    // Get modified content directly from working directory
    let full_file_path = repo_path.join(file_path);
    let modified_content = std::fs::read_to_string(&full_file_path).unwrap_or_else(|_| "".to_string());
    
    // Get original content from HEAD
    let original_content = if let Ok(head) = repo.head() {
        if let Ok(tree) = head.peel_to_tree() {
            if let Ok(entry) = tree.get_path(Path::new(file_path)) {
                if let Ok(object) = entry.to_object(&repo) {
                    if let Some(blob) = object.as_blob() {
                        String::from_utf8_lossy(blob.content()).to_string()
                    } else {
                        "".to_string()
                    }
                } else {
                    "".to_string()
                }
            } else {
                "".to_string() // File might be new
            }
        } else {
            "".to_string()
        }
    } else {
        "".to_string()
    };

    let mut diff_options = git2::DiffOptions::new();
    diff_options.pathspec(file_path);
    
    let diff = repo.diff_tree_to_workdir_with_index(
        repo.head()?.peel_to_tree().ok().as_ref(),
        Some(&mut diff_options)
    )?;

    let mut hunks = Vec::new();
    diff.foreach(
        &mut |_, _| true,
        None,
        Some(&mut |_, hunk| {
            // We need the full patch for this hunk to be able to reverse apply it later.
            // Since git2 doesn't easily give us the patch for a single hunk in string format,
            // we'll use git command as a fallback for the patch content if needed, 
            // but let's try to get it from git2 if possible.
            // Actually, git apply -R < patch is safer.
            hunks.push(Hunk {
                header: String::from_utf8_lossy(hunk.header()).to_string(),
                patch: "".to_string(), // We'll populate this in a second pass or via git command
                old_start: hunk.old_start(),
                old_lines: hunk.old_lines(),
                new_start: hunk.new_start(),
                new_lines: hunk.new_lines(),
            });
            true
        }),
        None,
    )?;

    // Second pass to get the actual patch strings for each hunk
    // This is tricky with git2's callback architecture.
    // Easier way: use git diff -U3 <file> and parse it or just get the whole file diff and split by hunk.
    
    let patch_output = std::process::Command::new("git")
        .arg("diff")
        .arg("-U3")
        .arg("--")
        .arg(file_path)
        .current_dir(repo_path)
        .output()?;
    
    let patch_str = String::from_utf8_lossy(&patch_output.stdout);
    let mut hunk_patches = Vec::new();
    
    let lines: Vec<&str> = patch_str.split('\n').collect();
    let mut current_patch = String::new();
    let mut in_hunk = false;

    // We need to construct a valid patch for EACH hunk.
    // A valid patch includes the header (--- a/file, +++ b/file)
    let header = format!("--- a/{file_path}\n+++ b/{file_path}\n");

    for line in lines {
        if line.starts_with("@@") {
            if in_hunk {
                hunk_patches.push(current_patch.clone());
            }
            current_patch = header.clone();
            current_patch.push_str(line);
            current_patch.push('\n');
            in_hunk = true;
        } else if in_hunk {
            current_patch.push_str(line);
            current_patch.push('\n');
        }
    }
    if in_hunk {
        hunk_patches.push(current_patch);
    }

    // Match identified hunks with their patches
    for (i, hunk) in hunks.iter_mut().enumerate() {
        if let Some(p) = hunk_patches.get(i) {
            hunk.patch = p.clone();
        }
    }

    Ok(FileDiff {
        original_content,
        modified_content,
        hunks,
    })
}

pub fn discard_file_changes(repo_path: &Path, file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    // 1. Unstage the file (git reset HEAD <file>)
    let _ = std::process::Command::new("git")
        .arg("reset")
        .arg("HEAD")
        .arg("--")
        .arg(file_path)
        .current_dir(repo_path)
        .output();

    // 2. Discard workdir changes (git checkout -- <file>)
    let checkout_res = std::process::Command::new("git")
        .arg("checkout")
        .arg("--")
        .arg(file_path)
        .current_dir(repo_path)
        .output();

    // 3. If it failed, it might be an untracked (new) file
    match checkout_res {
        Ok(output) if !output.status.success() => {
            // Check if it's a new file and delete if so
            let repo = Repository::open(repo_path)?;
            let status = repo.status_file(Path::new(file_path)).unwrap_or(git2::Status::empty());
            
            if status.contains(git2::Status::WT_NEW) || status.contains(git2::Status::INDEX_NEW) {
                let full_path = repo_path.join(file_path);
                if full_path.exists() {
                    if full_path.is_dir() {
                        std::fs::remove_dir_all(&full_path)?;
                    } else {
                        std::fs::remove_file(&full_path)?;
                    }
                }
            }
        },
        Err(e) => return Err(format!("Failed to execute git checkout: {}", e).into()),
        _ => {}
    }

    Ok(())
}

pub fn discard_all_changes(repo_path: &Path) -> Result<(), Box<dyn std::error::Error>> {
    // 1. Unstage everything
    let _ = std::process::Command::new("git")
        .arg("reset")
        .arg("HEAD")
        .arg("--")
        .arg(".")
        .current_dir(repo_path)
        .output();

    // 2. Discard modified/deleted files
    let _ = std::process::Command::new("git")
        .arg("checkout")
        .arg("--")
        .arg(".")
        .current_dir(repo_path)
        .output();

    // 3. Remove untracked files and directories
    let _ = std::process::Command::new("git")
        .arg("clean")
        .arg("-fd")
        .current_dir(repo_path)
        .output();

    Ok(())
}
pub fn discard_hunk(repo_path: &Path, patch: &str) -> Result<(), Box<dyn std::error::Error>> {
    use std::io::Write;
    
    let mut child = std::process::Command::new("git")
        .arg("apply")
        .arg("-R")
        .arg("--cached") // Also apply to index if possible, though mostly we want workdir
        .arg("-")
        .stdin(std::process::Stdio::piped())
        .current_dir(repo_path)
        .spawn()?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(patch.as_bytes())?;
    }

    let status = child.wait()?;
    
    // Also apply to workdir (we did --cached above, let's do workdir too for safety, 
    // or just omit --cached if we want both. Actually, git apply -R - applies to both by default if not specified)
    // Let's try without --cached first to revert workdir.
    
    if !status.success() {
        // Fallback or retry without --cached if it failed
         let mut child2 = std::process::Command::new("git")
            .arg("apply")
            .arg("-R")
            .arg("-")
            .stdin(std::process::Stdio::piped())
            .current_dir(repo_path)
            .spawn()?;

        if let Some(mut stdin) = child2.stdin.take() {
            stdin.write_all(patch.as_bytes())?;
        }
        child2.wait()?;
    }

    Ok(())
}
