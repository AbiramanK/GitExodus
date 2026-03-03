use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RepositoryInfo {
    pub name: String,
    pub path: String,
    pub remote_url: Option<String>,
    pub current_branch: String,
    pub local_branches: Vec<String>,
    pub is_dirty: bool,
    pub has_unpushed_commits: bool,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppInfo {
    pub id: String,
    pub name: String,
    pub binary: String,
    pub category: String, // "editor", "file-manager", etc.
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GitChange {
    pub path: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Hunk {
    pub header: String,
    pub patch: String,
    pub old_start: u32,
    pub old_lines: u32,
    pub new_start: u32,
    pub new_lines: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileDiff {
    pub original_content: String,
    pub modified_content: String,
    pub hunks: Vec<Hunk>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BulkRepoResult {
    pub path: String,
    pub name: String,
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BulkResult {
    pub results: Vec<BulkRepoResult>,
    pub total: usize,
    pub succeeded: usize,
    pub failed: usize,
}
