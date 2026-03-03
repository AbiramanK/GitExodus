import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gitApi } from '../redux/api/v2/gitApi';
import { configureStore } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/core';

describe('gitApi', () => {
  let store: any;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: {
        [gitApi.reducerPath]: gitApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(gitApi.middleware),
    });
  });

  it('commitRepo mutation calls invoke commit_repo', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.commitRepo.initiate({ path: '/p', message: 'm' }));
    expect(invoke).toHaveBeenCalledWith('commit_repo', { path: '/p', message: 'm' });
  });

  it('pushRepo mutation calls invoke push_repo_command', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.pushRepo.initiate('/p'));
    expect(invoke).toHaveBeenCalledWith('push_repo_command', { path: '/p' });
  });

  it('deleteRepo mutation calls invoke delete_repo', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.deleteRepo.initiate('/test/path'));
    expect(invoke).toHaveBeenCalledWith('delete_repo', { path: '/test/path' });
  });

  it('openFolder mutation calls invoke open_folder', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.openFolder.initiate('/test/path'));
    expect(invoke).toHaveBeenCalledWith('open_folder', { path: '/test/path' });
  });

  it('openWith mutation calls invoke open_with', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.openWith.initiate({ path: '/test', binary: 'code' }));
    expect(invoke).toHaveBeenCalledWith('open_with', { path: '/test', binary: 'code' });
  });

  it('bulkCommitAndPush mutation calls invoke bulk_commit_and_push', async () => {
    const result: any = { total: 1, succeeded: 1, failed: 0 };
    (invoke as any).mockResolvedValue(result);
    await store.dispatch(gitApi.endpoints.bulkCommitAndPush.initiate({ paths: ['/p1'], message: 'msg' }));
    expect(invoke).toHaveBeenCalledWith('bulk_commit_and_push', { paths: ['/p1'], message: 'msg' });
  });

  it('getAvailableApps query calls invoke get_available_apps', async () => {
    const apps = [{ id: '1', name: 'App', binary: 'app', category: 'cat' }];
    (invoke as any).mockResolvedValue(apps);
    await store.dispatch(gitApi.endpoints.getAvailableApps.initiate());
    expect(invoke).toHaveBeenCalledWith('get_available_apps');
  });

  it('getRepoChanges query calls invoke get_repo_changes', async () => {
    const changes: any[] = [{ path: 'file.txt', status: 'Modified' }];
    (invoke as any).mockResolvedValue(changes);
    const result = await store.dispatch(gitApi.endpoints.getRepoChanges.initiate('/test'));
    expect(result.data).toEqual(changes);
    expect(invoke).toHaveBeenCalledWith('get_repo_changes', { path: '/test' });
  });

  it('getFileDiffContent query calls invoke get_file_diff_content', async () => {
    const diff: any = { content: 'diff' };
    (invoke as any).mockResolvedValue(diff);
    const result = await store.dispatch(gitApi.endpoints.getFileDiffContent.initiate({ repoPath: '/repo', filePath: 'file.txt' }));
    expect(result.data).toEqual(diff);
    expect(invoke).toHaveBeenCalledWith('get_file_diff_content', { repoPath: '/repo', filePath: 'file.txt' });
  });

  it('handles API errors correctly', async () => {
    (invoke as any).mockRejectedValue('Error occurred');
    const result = await store.dispatch(gitApi.endpoints.getRepoChanges.initiate('/p'));
    expect(result.error).toBeDefined();
    expect(result.error).toBe('Error occurred');
  });

  it('calls discard_file_changes', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.discardFileChanges.initiate({ repoPath: '/p', filePath: 'f' }));
    expect(invoke).toHaveBeenCalledWith('discard_file_changes', { repoPath: '/p', filePath: 'f' });
  });

  it('calls discard_hunk', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.discardHunk.initiate({ repoPath: '/p', patch: 'pt' }));
    expect(invoke).toHaveBeenCalledWith('discard_hunk', { repoPath: '/p', patch: 'pt' });
  });

  it('calls discard_all_changes', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.discardAllChanges.initiate('/p'));
    expect(invoke).toHaveBeenCalledWith('discard_all_changes', { repoPath: '/p' });
  });

  it('handles commit_repo error', async () => {
    (invoke as any).mockRejectedValue('Commit failed');
    const result = await store.dispatch(gitApi.endpoints.commitRepo.initiate({ path: '/p', message: 'm' }));
    expect(result.error).toBe('Commit failed');
  });

  it('handles push_repo error', async () => {
    (invoke as any).mockRejectedValue('Push failed');
    const result = await store.dispatch(gitApi.endpoints.pushRepo.initiate('/p'));
    expect(result.error).toBe('Push failed');
  });

  it('handles delete_repo error', async () => {
    (invoke as any).mockRejectedValue('Delete failed');
    const result = await store.dispatch(gitApi.endpoints.deleteRepo.initiate('/p'));
    expect(result.error).toBe('Delete failed');
  });

  it('handles open_folder error', async () => {
    (invoke as any).mockRejectedValue('Open failed');
    const result = await store.dispatch(gitApi.endpoints.openFolder.initiate('/p'));
    expect(result.error).toBe('Open failed');
  });

  it('handles bulkCommitAndPush error', async () => {
    (invoke as any).mockRejectedValue('Bulk failed');
    const result = await store.dispatch(gitApi.endpoints.bulkCommitAndPush.initiate({ paths: ['/p'], message: 'm' }));
    expect(result.error).toBe('Bulk failed');
  });
});
