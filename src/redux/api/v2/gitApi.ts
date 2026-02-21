import { createApi } from '@reduxjs/toolkit/query/react';
import { invoke } from '@tauri-apps/api/core';
export interface AppInfo {
  id: string;
  name: string;
  binary: string;
  category: string;
}

export const gitApi = createApi({
  reducerPath: 'gitApi',
  baseQuery: (arg: any) => ({ data: arg }),
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
  }),
});

export const { 
    useCommitRepoMutation, 
    usePushRepoMutation, 
    useDeleteRepoMutation,
    useOpenFolderMutation,
    useGetAvailableAppsQuery,
    useOpenWithMutation
} = gitApi;
