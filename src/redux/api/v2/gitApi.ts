import { createApi } from '@reduxjs/toolkit/query/react';
import { invoke } from '@tauri-apps/api/core';
import { ScanResult } from './apiResponse';

export const gitApi = createApi({
  reducerPath: 'gitApi',
  baseQuery: (arg: any) => ({ data: arg }),
  endpoints: (builder) => ({
    scanRepos: builder.query<ScanResult, string>({
      queryFn: async (rootPath) => {
        try {
          const result = await invoke<ScanResult>('scan_repos', { rootPath });
          return { data: result };
        } catch (error) {
          return { error: error as string };
        }
      },
    }),
    commitRepo: builder.mutation<void, { path: string; message: string }>({
      queryFn: async ({ path, message }) => {
        try {
          await invoke('commit_repo', { path, message });
          return { data: undefined };
        } catch (error) {
          return { error: error as string };
        }
      },
      // Invalidate tags or handle refresh logic
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
  }),
});

export const { 
    useScanReposQuery, 
    useCommitRepoMutation, 
    usePushRepoMutation, 
    useDeleteRepoMutation,
    useOpenFolderMutation
} = gitApi;
