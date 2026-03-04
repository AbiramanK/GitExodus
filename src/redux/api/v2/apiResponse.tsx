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

export interface Hunk {
    header: string;
    patch: string;
    old_start: number;
    old_lines: number;
    new_start: number;
    new_lines: number;
}

export interface FileDiff {
    original_content: string;
    modified_content: string;
    hunks: Hunk[];
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

export interface GitCommitInfo {
    id: string;
    message: string;
    author: string;
    time: number;
    branches: string[];
}

export interface BranchInfo {
    name: string;
    is_remote: boolean;
    is_head: boolean;
    upstream: string | null;
    ahead: number;
    behind: number;
}
