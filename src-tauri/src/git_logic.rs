use git2::Repository;
use crate::models::RepositoryInfo;
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
    let mut callbacks = git2::RemoteCallbacks::new();
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
