use tauri_appgit_exodus_lib::git_logic;
use tempfile::TempDir;
use std::fs;
use git2::Repository;

#[test]
fn test_analyze_repo_basic() {
    let dir = TempDir::new().unwrap();
    Repository::init(dir.path()).unwrap();
    
    let info = git_logic::analyze_repo(dir.path()).unwrap();
    assert_eq!(info.is_dirty, false);
}

#[test]
fn test_desktop_parsing_logic() {
    let dir = TempDir::new().unwrap();
    let desktop_file = dir.path().join("intellij.desktop");
    let content = "[Desktop Entry]\nName=IntelliJ IDEA\nExec=\"/path/to/idea.sh\" %f\n";
    fs::write(&desktop_file, content).unwrap();

    // Check parsing logic (extracted from app_discovery)
    let content = fs::read_to_string(&desktop_file).unwrap();
    if content.contains("Name=IntelliJ") {
        if let Some(exec_line) = content.lines().find(|l| l.starts_with("Exec=")) {
            let full_exec = exec_line.replacen("Exec=", "", 1);
            let bin = full_exec.split_whitespace().next().unwrap_or_default().trim_matches('"');
            assert_eq!(bin, "/path/to/idea.sh");
        }
    }
}
