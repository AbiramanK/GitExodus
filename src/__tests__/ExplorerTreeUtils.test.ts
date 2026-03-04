import { describe, it, expect } from 'vitest';
import { buildExplorerTree } from '../lib/repoUtils';
import { RepositoryInfo } from '../redux/api/v2/apiResponse';

describe('buildExplorerTree', () => {
  it('should build a nested tree from a list of repo paths', () => {
    const repos: RepositoryInfo[] = [
      { path: '/home/user/project1', name: 'project1', current_branch: 'main', is_dirty: false, has_unpushed_commits: false, remote_url: null, local_branches: ['main'] },
      { path: '/home/user/work/project2', name: 'project2', current_branch: 'dev', is_dirty: true, has_unpushed_commits: false, remote_url: null, local_branches: ['dev'] },
      { path: '/home/user/work/sub/project3', name: 'project3', current_branch: 'main', is_dirty: false, has_unpushed_commits: true, remote_url: null, local_branches: ['main'] },
    ];

    const tree = buildExplorerTree(repos);

    expect(tree.name).toBe('Root');
    expect(tree.children.length).toBe(1); // 'home'
    
    const home = tree.children[0];
    expect(home.name).toBe('home');
    expect(home.children[0].name).toBe('user');
    
    const user = home.children[0];
    expect(user.children.length).toBe(2); // 'project1' and 'work'
    
    const p1 = user.children.find(c => c.name === 'project1');
    expect(p1?.type).toBe('repo');
    expect(p1?.repo?.name).toBe('project1');
    
    const work = user.children.find(c => c.name === 'work');
    expect(work?.type).toBe('folder');
    expect(work?.children.length).toBe(2); // 'project2' and 'sub'
  });

  it('should sort folders before repos and then alphabetically', () => {
    const repos: RepositoryInfo[] = [
      { path: '/z_repo', name: 'z_repo', current_branch: 'main', is_dirty: false, has_unpushed_commits: false, remote_url: null, local_branches: ['main'] },
      { path: '/a_folder/some_repo', name: 'some_repo', current_branch: 'main', is_dirty: false, has_unpushed_commits: false, remote_url: null, local_branches: ['main'] },
    ];

    const tree = buildExplorerTree(repos);
    expect(tree.children[0].name).toBe('a_folder');
    expect(tree.children[1].name).toBe('z_repo');
  });
});
