use crate::models::{AppInfo, GitChange, FileDiff};
use crate::git_logic::{analyze_repo, commit_all, push_repo, safe_delete, get_repo_changes as git_get_changes, get_file_diff_content as git_get_diff};
use crate::app_discovery::get_detected_apps;
use std::path::PathBuf;
use std::process::Command;

#[tauri::command]
pub async fn scan_repos(root_path: String, app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Emitter;
    use ignore::WalkBuilder;
    
    let root = PathBuf::from(root_path);
    
    // Spawn background task
    tokio::spawn(async move {
        let _ = app.emit("scan-started", ());
        
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
