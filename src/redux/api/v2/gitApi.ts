import { createApi } from '@reduxjs/toolkit/query/react';
import { invoke } from '@tauri-apps/api/core';
export interface AppInfo {
  id: string;
  name: string;
  binary: string;
  category: string;
}

import { GitChange, FileDiff, BulkResult, GitCommitInfo, BranchInfo } from './apiResponse';

export const gitApi = createApi({
  reducerPath: 'gitApi',
  baseQuery: (arg: any) => ({ data: arg }),
  tagTypes: ['RepoChanges', 'RepoList'],
  endpoints: (builder) => ({
    commitRepo: builder.mutation<void, { path: string; message: string }>({
      queryFn: async ({ path, message }) => {
        try {
          await invoke('commit_repo', { path, message });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: ['RepoList'],
    }),
    pushRepo: builder.mutation<void, string>({
      queryFn: async (path) => {
        try {
          await invoke('push_repo_command', { path });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: ['RepoList'],
    }),
    deleteRepo: builder.mutation<void, string>({
      queryFn: async (path) => {
        try {
          await invoke('delete_repo', { path });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: ['RepoList'],
    }),
    openFolder: builder.mutation<void, string>({
      queryFn: async (path) => {
        try {
          await invoke('open_folder', { path });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
    getAvailableApps: builder.query<AppInfo[], void>({
      queryFn: async () => {
        try {
          const result = await invoke<AppInfo[]>('get_available_apps');
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
    openWith: builder.mutation<void, { path: string; binary: string }>({
      queryFn: async ({ path, binary }) => {
        try {
          await invoke('open_with', { path, binary });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
    getRepoChanges: builder.query<GitChange[], string>({
      queryFn: async (path) => {
        try {
          const result = await invoke<GitChange[]>('get_repo_changes', { path });
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
      providesTags: (_result, _error, path) => [{ type: 'RepoChanges', id: path }],
    }),
    getFileDiffContent: builder.query<FileDiff, { repoPath: string; filePath: string }>({
      queryFn: async ({ repoPath, filePath }) => {
        try {
          const result = await invoke<FileDiff>('get_file_diff_content', { repoPath, filePath });
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
    bulkCommitAndPush: builder.mutation<BulkResult, { paths: string[]; message: string }>({
      queryFn: async ({ paths, message }) => {
        try {
          const result = await invoke<BulkResult>('bulk_commit_and_push', { paths, message });
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: ['RepoList'],
    }),
    discardFileChanges: builder.mutation<void, { repoPath: string; filePath: string }>({
      queryFn: async ({ repoPath, filePath }) => {
        try {
          await invoke('discard_file_changes', { repoPath, filePath });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: (_result, _error, { repoPath }) => [
        { type: 'RepoChanges', id: repoPath },
        'RepoList'
      ],
    }),
    discardAllChanges: builder.mutation<void, string>({
      queryFn: async (repoPath) => {
        try {
          await invoke('discard_all_changes', { repoPath });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: (_result, _error, repoPath) => [
        { type: 'RepoChanges', id: repoPath },
        'RepoList'
      ],
    }),
    discardHunk: builder.mutation<void, { repoPath: string; patch: string }>({
      queryFn: async ({ repoPath, patch }) => {
        try {
          await invoke('discard_hunk', { repoPath, patch });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      invalidatesTags: (_result, _error, { repoPath }) => [
        { type: 'RepoChanges', id: repoPath }
      ],
    }),
    getRepoLog: builder.query<GitCommitInfo[], string>({
      queryFn: async (path) => {
        try {
          const result = await invoke<GitCommitInfo[]>('get_repo_log', { path });
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
    getRepoBranches: builder.query<BranchInfo[], string>({
      queryFn: async (path) => {
        try {
          const result = await invoke<BranchInfo[]>('get_repo_branches', { path });
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
  }),
});

export const { 
    useCommitRepoMutation, 
    usePushRepoMutation, 
    useDeleteRepoMutation,
    useOpenFolderMutation,
    useGetAvailableAppsQuery,
    useOpenWithMutation,
    useGetRepoChangesQuery,
    useGetFileDiffContentQuery,
    useBulkCommitAndPushMutation,
    useDiscardFileChangesMutation,
    useDiscardAllChangesMutation,
    useDiscardHunkMutation,
    useGetRepoLogQuery,
    useGetRepoBranchesQuery
} = gitApi;
