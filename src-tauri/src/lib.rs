pub mod models;
pub mod scanner;
pub mod git_logic;
pub mod app_discovery;
pub mod commands;

use tauri::Emitter;
use tauri::Manager;
use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            scan_repos,
            commit_repo,
            push_repo_command,
            delete_repo,
            open_folder,
            get_available_apps,
            open_with,
            get_repo_changes,
            get_file_diff_content,
            bulk_commit_and_push,
            discard_file_changes,
            discard_all_changes,
            exit_app
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                window.emit("request-exit", ()).unwrap();
            }
        })
        .setup(|app| {
            // Force set icon for development mode on Linux
            let window = app.get_webview_window("main").unwrap();
            
            // Resolve path to the icon. In dev, we look in src-tauri/icons.
            // Note: In a bundled app, this would be in the resources directory.
            let icon_path = std::path::PathBuf::from("src-tauri/icons/icon.png");
            
            if let Ok(icon) = tauri::image::Image::from_path(icon_path) {
                let _ = window.set_icon(icon);
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
