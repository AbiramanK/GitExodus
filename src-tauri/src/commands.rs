use crate::models::{AppInfo, GitChange, FileDiff, BulkRepoResult, BulkResult, GitCommitInfo, BranchInfo};
use crate::git_logic::{self, analyze_repo, commit_all, push_repo, safe_delete, get_repo_changes as git_get_changes, get_file_diff_content as git_get_diff, discard_file_changes as git_discard_changes, discard_all_changes as git_discard_all};
use crate::app_discovery::get_detected_apps;
use std::path::{PathBuf, Path};
use std::process::Command;

#[tauri::command]
pub async fn scan_repos(root_paths: Vec<String>, app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Emitter;
    use ignore::WalkBuilder;
    
    // Spawn background task
    tokio::spawn(async move {
        let _ = app.emit("scan-started", ());
        
        for root_path in root_paths {
            let root = PathBuf::from(root_path);
            let walker = WalkBuilder::new(root)
                .hidden(false) // We need to see .git
                .git_ignore(false) 
                .git_global(false)
                .git_exclude(false)
                .filter_entry(|entry| {
                    let path = entry.path();
                    if path.is_dir() {
                        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                            if name == "node_modules" || name == ".cache" || name == "target" || name == ".git" && path.parent().is_some() {
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
                                    match analyze_repo(parent) {
                                        Ok(info) => {
                                            let _ = app.emit("repo-detected", info);
                                        }
                                        Err(e) => {
                                            let _ = app.emit("scan-error", format!("Error analyzing {}: {}", parent.display(), e));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        let _ = app.emit("scan-finished", ());
    });

    Ok(())
}

#[tauri::command]
pub async fn commit_repo(path: String, message: String) -> Result<(), String> {
    commit_all(&PathBuf::from(path), &message).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn push_repo_command(path: String) -> Result<(), String> {
    push_repo(&PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_repo(path: String) -> Result<(), String> {
    safe_delete(&PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn open_folder(path: String, app: tauri::AppHandle) -> Result<(), String> {
    use tauri_plugin_opener::OpenerExt;
    app.opener().open_path(path, None::<String>).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_available_apps() -> Result<Vec<AppInfo>, String> {
    Ok(get_detected_apps())
}

#[tauri::command]
pub async fn open_with(path: String, binary: String) -> Result<(), String> {
    Command::new(binary)
        .arg(path)
        .spawn()
        .map_err(|e| format!("Failed to launch application: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn get_repo_changes(path: String) -> Result<Vec<GitChange>, String> {
    git_get_changes(&PathBuf::from(path)).map_err(|e: Box<dyn std::error::Error>| e.to_string())
}

#[tauri::command]
pub async fn get_file_diff_content(repo_path: String, file_path: String) -> Result<FileDiff, String> {
    git_get_diff(&PathBuf::from(repo_path), &file_path).map_err(|e: Box<dyn std::error::Error>| e.to_string())
}

#[tauri::command]
pub async fn bulk_commit_and_push(paths: Vec<String>, message: String) -> Result<BulkResult, String> {
    use crate::git_logic::analyze_repo;

    let total = paths.len();
    let mut results: Vec<BulkRepoResult> = Vec::new();

    for path_str in &paths {
        let path = PathBuf::from(path_str);
        let name = path.file_name().and_then(|n| n.to_str()).unwrap_or(path_str).to_string();

        let repo_info = match analyze_repo(&path) {
            Ok(info) => info,
            Err(e) => {
                results.push(BulkRepoResult { path: path_str.clone(), name, success: false, error: Some(e.to_string()) });
                continue;
            }
        };

        let mut op_error: Option<String> = None;

        // Commit if dirty
        if repo_info.is_dirty {
            if let Err(e) = commit_all(&path, &message) {
                op_error = Some(format!("Commit failed: {}", e));
            }
        }

        // Push if unpushed (or if we just committed). 
        // We use push --all here to satisfy "all the branches" request.
        if op_error.is_none() && (repo_info.has_unpushed_commits || repo_info.is_dirty) {
            let push_res = Command::new("git")
                .arg("push")
                .arg("--all")
                .current_dir(&path)
                .output();
            
            if let Err(e) = push_res {
                op_error = Some(format!("Push failed: {}", e));
            } else if !push_res.unwrap().status.success() {
                 op_error = Some("Push failed (git exit code non-zero)".to_string());
            }
        }

        let success = op_error.is_none();
        results.push(BulkRepoResult { path: path_str.clone(), name, success, error: op_error });
    }

    let succeeded = results.iter().filter(|r| r.success).count();
    let failed = results.iter().filter(|r| !r.success).count();

    Ok(BulkResult { results, total, succeeded, failed })
}

#[tauri::command]
pub fn exit_app(app_handle: tauri::AppHandle) {
    app_handle.exit(0);
}

#[tauri::command]
pub async fn discard_file_changes(repo_path: String, file_path: String) -> Result<(), String> {
    git_discard_changes(&PathBuf::from(repo_path), &file_path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn discard_all_changes(repo_path: String) -> Result<(), String> {
    git_discard_all(&PathBuf::from(repo_path)).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn discard_hunk(repo_path: String, patch: String) -> Result<(), String> {
    git_logic::discard_hunk(Path::new(&repo_path), &patch)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_repo_log(path: String) -> Result<Vec<GitCommitInfo>, String> {
    git_logic::get_repo_log(Path::new(&path)).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_repo_branches(path: String) -> Result<Vec<BranchInfo>, String> {
    git_logic::get_branches(Path::new(&path)).map_err(|e| e.to_string())
}
