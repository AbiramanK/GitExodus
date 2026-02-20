use ignore::WalkBuilder;
use std::path::PathBuf;

pub fn scan_for_repos(root: PathBuf) -> Vec<PathBuf> {
    let mut repos = Vec::new();
    let walker = WalkBuilder::new(root)
        .hidden(false) // We need to see .git
        .git_ignore(false) // Don't ignore things based on .gitignore during scan
        .git_global(false)
        .git_exclude(false)
        .filter_entry(|entry| {
            let path = entry.path();
            if path.is_dir() {
                if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                    // Explicitly ignore heavy or irrelevant directories
                    if name == "node_modules" || name == ".cache" || name == "target" || name == ".git" && path.parent().is_some() {
                        // We allow .git itself but we want to stop recursing if we find it
                        // Actually if we find .git, we mark the parent as a repo and stop recursing into .git
                        return true; 
                    }
                    if name == "node_modules" || name == ".cache" || name == "target" {
                        return false;
                    }
                }
            }
            true
        })
        .build();

    for result in walker {
        if let Ok(entry) = result {
            if entry.path().is_dir() {
                if let Some(name) = entry.path().file_name().and_then(|n| n.to_str()) {
                    if name == ".git" {
                        if let Some(parent) = entry.path().parent() {
                            repos.push(parent.to_path_buf());
                        }
                    }
                }
            }
        }
    }
    
    // De-duplicate and filter parents (optional but good practice)
    repos.sort();
    repos.dedup();
    repos
}
