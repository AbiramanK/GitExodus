pub mod models;
pub mod scanner;
pub mod git_logic;
pub mod app_discovery;
pub mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_repos,
            commit_repo,
            push_repo_command,
            delete_repo,
            open_folder,
            get_available_apps,
            open_with
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
