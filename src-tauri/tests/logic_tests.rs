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
#[test]
fn test_hunk_discard_logic() {
    let dir = TempDir::new().unwrap();
    let repo_path = dir.path();
    Repository::init(repo_path).unwrap();
    
    let file_path = repo_path.join("test.txt");
    fs::write(&file_path, "line1\nl2\nl3\nl4\nl5\nl6\nl7\nl8\nl9\nl10\nl11\nl12\nline3\n").unwrap();
    
    // Commit the file
    let repo = Repository::open(repo_path).unwrap();
    let mut config = repo.config().unwrap();
    config.set_str("user.name", "Test User").unwrap();
    config.set_str("user.email", "test@example.com").unwrap();
    
    let mut index = repo.index().unwrap();
    index.add_path(std::path::Path::new("test.txt")).unwrap();
    index.write().unwrap();
    
    let oid = index.write_tree().unwrap();
    let tree = repo.find_tree(oid).unwrap();
    let sig = repo.signature().unwrap();
    repo.commit(Some("HEAD"), &sig, &sig, "initial", &tree, &[]).unwrap();
    
    // Modify the file (2 hunks)
    fs::write(&file_path, "line1 changed\nl2\nl3\nl4\nl5\nl6\nl7\nl8\nl9\nl10\nl11\nl12\nline3 changed\n").unwrap();
    
    // Get diff and extract hunks
    let diff = git_logic::get_file_diff_content(repo_path, "test.txt").unwrap();
    assert_eq!(diff.hunks.len(), 2);
    
    // Discard the first hunk (line1 changed -> line1)
    let patch = diff.hunks[0].patch.clone();
    git_logic::discard_hunk(repo_path, &patch).unwrap();
    
    // Check content
    let content = fs::read_to_string(&file_path).unwrap();
    assert_eq!(content, "line1\nl2\nl3\nl4\nl5\nl6\nl7\nl8\nl9\nl10\nl11\nl12\nline3 changed\n");
}
