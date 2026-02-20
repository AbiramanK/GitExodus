use crate::models::{RepositoryInfo, ScanResult};
use crate::scanner::scan_for_repos;
use crate::git_logic::{analyze_repo, commit_all, push_repo, safe_delete};
use std::path::PathBuf;

#[tauri::command]
pub async fn scan_repos(root_path: String) -> Result<ScanResult, String> {
    let root = PathBuf::from(root_path);
    let repo_paths = scan_for_repos(root);
    
    let mut repositories = Vec::new();
    let mut errors = Vec::new();

    for path in repo_paths {
        match analyze_repo(&path) {
            Ok(info) => repositories.push(info),
            Err(e) => errors.push(format!("Error analyzing {}: {}", path.display(), e)),
        }
    }

    Ok(ScanResult {
        repositories,
        errors,
    })
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
pub async fn open_folder(path: String, app: &tauri::AppHandle) -> Result<(), String> {
    use tauri_plugin_opener::OpenerExt;
    app.opener().open_path(path, None::<String>).map_err(|e| e.to_string())
}
