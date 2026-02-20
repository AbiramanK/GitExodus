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

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanResult {
    pub repositories: Vec<RepositoryInfo>,
    pub errors: Vec<String>,
}
