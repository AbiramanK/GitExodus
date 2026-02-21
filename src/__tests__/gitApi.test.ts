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

  it('calls commit_repo command', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.commitRepo.initiate({ path: '/test', message: 'msg' }));
    expect(invoke).toHaveBeenCalledWith('commit_repo', { path: '/test', message: 'msg' });
  });

  it('calls push_repo_command', async () => {
    (invoke as any).mockResolvedValue(undefined);
    await store.dispatch(gitApi.endpoints.pushRepo.initiate('/test'));
    expect(invoke).toHaveBeenCalledWith('push_repo_command', { path: '/test' });
  });

  it('calls get_available_apps and returns data', async () => {
    const apps = [{ id: '1', name: 'App', binary: 'app', category: 'cat' }];
    (invoke as any).mockResolvedValue(apps);
    const result = await store.dispatch(gitApi.endpoints.getAvailableApps.initiate());
    expect(result.data).toEqual(apps);
    expect(invoke).toHaveBeenCalledWith('get_available_apps');
  });

  it('handles errors gracefully', async () => {
    (invoke as any).mockRejectedValue('Error message');
    const result = await store.dispatch(gitApi.endpoints.deleteRepo.initiate('/test'));
    expect(result.error).toBe('Error message');
  });
});
