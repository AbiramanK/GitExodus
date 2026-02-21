import { describe, it, expect } from 'vitest';
import repoReducer, { addRepo, startScan, finishScan, setScanError, updateRepo, removeRepo } from '../redux/slices/repoSlice';
import { RepositoryInfo } from '../redux/api/v2/apiResponse';

describe('repoSlice', () => {
  const initialState = {
    repositories: [],
    isScanning: false,
    scanError: null,
  };

  it('should handle initial state', () => {
    expect(repoReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle startScan', () => {
    const actual = repoReducer(initialState, startScan());
    expect(actual.isScanning).toBe(true);
  });

  it('should handle addRepo', () => {
    const repo: RepositoryInfo = {
      name: 'test-repo',
      path: '/path/to/test-repo',
      remote_url: null,
      current_branch: 'master',
      local_branches: ['master'],
      is_dirty: false,
      has_unpushed_commits: false,
    };
    const actual = repoReducer(initialState, addRepo(repo));
    expect(actual.repositories).toHaveLength(1);
    expect(actual.repositories[0]).toEqual(repo);
  });

  it('should handle finishScan', () => {
    const state = { ...initialState, isScanning: true };
    const actual = repoReducer(state, finishScan());
    expect(actual.isScanning).toBe(false);
  });

  it('should handle setScanError', () => {
    const error = 'Failed to scan';
    const state = { ...initialState, isScanning: true };
    const actual = repoReducer(state, setScanError(error));
    expect(actual.isScanning).toBe(false);
    expect(actual.scanError).toBe(error);
  });

  it('should handle updateRepo', () => {
    const repo: RepositoryInfo = {
      name: 'old-name',
      path: '/path/1',
      remote_url: null,
      current_branch: 'master',
      local_branches: ['master'],
      is_dirty: false,
      has_unpushed_commits: false,
    };
    const updatedRepo = { ...repo, name: 'new-name' };
    const state = { ...initialState, repositories: [repo] };
    const actual = repoReducer(state, updateRepo(updatedRepo));
    expect(actual.repositories[0].name).toBe('new-name');
  });

  it('should handle removeRepo', () => {
    const repo: RepositoryInfo = {
        name: 'test',
        path: '/path/1',
        remote_url: null,
        current_branch: 'master',
        local_branches: ['master'],
        is_dirty: false,
        has_unpushed_commits: false,
      };
      const state = { ...initialState, repositories: [repo] };
      const actual = repoReducer(state, removeRepo('/path/1'));
      expect(actual.repositories).toHaveLength(0);
  });
});
