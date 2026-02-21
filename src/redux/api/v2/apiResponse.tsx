export interface RepositoryInfo {
    name: string;
    path: string;
    remote_url: string | null;
    current_branch: string;
    local_branches: string[];
    is_dirty: boolean;
    has_unpushed_commits: boolean;
}

export interface GitChange {
    path: string;
    status: string;
}

export interface FileDiff {
    original_content: string;
    modified_content: string;
}

export interface BulkRepoResult {
    path: string;
    name: string;
    success: boolean;
    error: string | null;
}

export interface BulkResult {
    results: BulkRepoResult[];
    total: number;
    succeeded: number;
    failed: number;
}
