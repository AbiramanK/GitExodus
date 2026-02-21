import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRepoTable } from '../hooks/table/v2/useRepoTable';
import { RepositoryInfo } from '../redux/api/v2/apiResponse';

const mockRepos: RepositoryInfo[] = [
  { name: 'dirty-repo', path: '/dirty', remote_url: null, current_branch: 'master', local_branches: ['master'], is_dirty: true, has_unpushed_commits: false },
  { name: 'clean-repo', path: '/clean', remote_url: null, current_branch: 'main', local_branches: ['main'], is_dirty: false, has_unpushed_commits: false },
  { name: 'unpushed-repo', path: '/unpushed', remote_url: null, current_branch: 'develop', local_branches: ['develop'], is_dirty: false, has_unpushed_commits: true },
];

describe('useRepoTable hook', () => {
  it('filters by search term', () => {
    const { result } = renderHook(() => useRepoTable(mockRepos));
    
    act(() => {
      result.current.setSearchTerm('dirty');
    });
    
    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe('dirty-repo');
  });

  it('filters by dirty status', () => {
    const { result } = renderHook(() => useRepoTable(mockRepos));
    
    act(() => {
      result.current.setFilterDirty(true);
    });
    
    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].is_dirty).toBe(true);
  });

  it('filters by unpushed status', () => {
    const { result } = renderHook(() => useRepoTable(mockRepos));
    
    act(() => {
      result.current.setFilterUnpushed(true);
    });
    
    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].has_unpushed_commits).toBe(true);
  });

  it('filters by branch', () => {
    const { result } = renderHook(() => useRepoTable(mockRepos));
    
    act(() => {
      result.current.setFilterBranch('main');
    });
    
    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].current_branch).toBe('main');
  });

  it('extracts unique branches', () => {
    const { result } = renderHook(() => useRepoTable(mockRepos));
    expect(result.current.branches).toContain('master');
    expect(result.current.branches).toContain('main');
    expect(result.current.branches).toContain('develop');
    expect(result.current.branches).toHaveLength(3);
  });
});
