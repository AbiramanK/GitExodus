use crate::models::AppInfo;
use std::process::Command;

pub fn get_detected_apps() -> Vec<AppInfo> {
    let mut apps = Vec::new();

    // Curated list of common apps
    let candidates = vec![
        ("vscode", "VS Code", "code", "editor"),
        ("cursor", "Cursor", "cursor", "editor"),
        ("intellij", "IntelliJ IDEA", "idea", "editor"),
        ("android-studio", "Android Studio", "studio", "editor"),
        ("antigravity", "Antigravity", "antigravity", "editor"),
        ("atom", "Atom", "atom", "editor"),
        ("sublime", "Sublime Text", "subl", "editor"),
        ("nautilus", "Files (Nautilus)", "nautilus", "file-manager"),
        ("dolphin", "Dolphin", "dolphin", "file-manager"),
        ("thunar", "Thunar", "thunar", "file-manager"),
        ("pcmanfm", "PCManFM", "pcmanfm", "file-manager"),
    ];

    for (id, name, binary_name, category) in candidates {
        // 1. Check system PATH first
        let binaries = match id {
            "intellij" => vec!["idea", "intellij-idea-ultimate", "intellij-idea-community", "idea-ultimate", "idea-community"],
            "android-studio" => vec!["studio", "android-studio"],
            "antigravity" => vec!["antigravity", "antigravity-editor"],
            _ => vec![binary_name],
        };

        let mut found = false;
        for bin in &binaries {
            if is_binary_available(bin) {
                apps.push(AppInfo {
                    id: id.to_string(),
                    name: name.to_string(),
                    binary: bin.to_string(),
                    category: category.to_string(),
                });
                found = true;
                break;
            }
        }

        if found { continue; }

        // 2. If not in PATH, try discovery in standard manual install folders
        #[cfg(unix)]
        {
            if let Some(home) = std::env::var_os("HOME").map(std::path::PathBuf::from) {
                let search_roots = vec![
                    home.join(".local/share/jetbrains/toolbox/apps"), // JetBrains Toolbox standard
                    std::path::PathBuf::from("/opt"),                 // Standard for add-on software
                ];

                let target_script = match id {
                    "intellij" => "idea.sh",
                    "android-studio" => "studio.sh",
                    _ => "",
                };

                if !target_script.is_empty() {
                    for root in search_roots {
                        if root.exists() {
                            // Find the script in subdirectories (depth 2 should be enough for /bin/ or /idea-IU-xxx/bin/)
                            if let Ok(entries) = std::fs::read_dir(&root) {
                                for entry in entries.flatten() {
                                    let path = entry.path();
                                    if path.is_dir() {
                                        // Try bin subfolder or direct subfolder
                                        let bin_path = path.join("bin").join(target_script);
                                        let direct_path = path.join(target_script);
                                        
                                        let final_path = if bin_path.exists() { Some(bin_path) }
                                                        else if direct_path.exists() { Some(direct_path) }
                                                        else { None };

                                        if let Some(p) = final_path {
                                            apps.push(AppInfo {
                                                id: id.to_string(),
                                                name: name.to_string(),
                                                binary: p.to_string_lossy().to_string(),
                                                category: category.to_string(),
                                            });
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if found { break; }
                    }
                }

                if found { continue; }

                // 3. Fallback: Search in .desktop entries (Linux standard)
                let desktop_roots = vec![
                    home.join(".local/share/applications"),
                    std::path::PathBuf::from("/usr/share/applications"),
                    std::path::PathBuf::from("/usr/local/share/applications"),
                ];

                for root in desktop_roots {
                    if let Ok(entries) = std::fs::read_dir(&root) {
                        for entry in entries.flatten() {
                            let path = entry.path();
                            if path.extension().and_then(|s| s.to_str()) == Some("desktop") {
                                if let Ok(content) = std::fs::read_to_string(&path) {
                                    let is_match = match id {
                                        "intellij" => content.contains("Name=IntelliJ") || path.to_string_lossy().contains("idea"),
                                        "android-studio" => content.contains("Name=Android Studio") || path.to_string_lossy().contains("studio"),
                                        _ => false,
                                    };

                                    if is_match {
                                        // Extract Exec line
                                        if let Some(exec_line) = content.lines().find(|l| l.starts_with("Exec=")) {
                                            let full_exec = exec_line.replacen("Exec=", "", 1);
                                            // Split and take first part (binary path), handling quotes
                                            let bin = full_exec.split_whitespace().next().unwrap_or_default().trim_matches('"');
                                            if !bin.is_empty() && std::path::Path::new(bin).exists() {
                                                apps.push(AppInfo {
                                                    id: id.to_string(),
                                                    name: name.to_string(),
                                                    binary: bin.to_string(),
                                                    category: category.to_string(),
                                                });
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if found { break; }
                }
            }
        }
    }

    apps
}

fn is_binary_available(binary: &str) -> bool {
    #[cfg(unix)]
    {
        Command::new("which")
            .arg(binary)
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false)
    }

    #[cfg(windows)]
    {
        Command::new("where")
            .arg(binary)
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false)
    }
}
