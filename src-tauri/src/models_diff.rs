use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct GitChange {
    pub path: String,
    pub status: String, // e.g., "modified", "added", "deleted"
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FileDiff {
    pub original_content: String,
    pub modified_content: String,
}
