import { describe, it, expect } from 'vitest';
import { groupRepositoriesByFolder } from '../lib/repoUtils';
import { RepositoryInfo } from '../redux/api/v2/apiResponse';

describe('repoUtils', () => {
    const mockRepos: RepositoryInfo[] = [
        {
            name: 'repo1',
            path: '/home/user/projects/web/repo1',
            remote_url: null,
            current_branch: 'main',
            local_branches: ['main'],
            is_dirty: false,
            has_unpushed_commits: false
        },
        {
            name: 'repo2',
            path: '/home/user/projects/web/repo2',
            remote_url: null,
            current_branch: 'main',
            local_branches: ['main'],
            is_dirty: true,
            has_unpushed_commits: false
        },
        {
            name: 'repo3',
            path: '/home/user/projects/mobile/repo3',
            remote_url: null,
            current_branch: 'dev',
            local_branches: ['dev', 'main'],
            is_dirty: false,
            has_unpushed_commits: true
        }
    ];

    it('groups repositories by parent folder', () => {
        const groups = groupRepositoriesByFolder(mockRepos);
        
        expect(groups).toHaveLength(2); // web and mobile
        
        const webGroup = groups.find(g => g.folderName === 'web');
        const mobileGroup = groups.find(g => g.folderName === 'mobile');
        
        expect(webGroup).toBeDefined();
        expect(webGroup?.repositories).toHaveLength(2);
        expect(webGroup?.basePath).toBe('/home/user/projects/web/');
        
        expect(mobileGroup).toBeDefined();
        expect(mobileGroup?.repositories).toHaveLength(1);
        expect(mobileGroup?.repositories[0].name).toBe('repo3');
    });

    it('handles root repositories or repos without deep paths', () => {
        const rootRepos: RepositoryInfo[] = [
            {
                name: 'root-repo',
                path: '/root-repo',
                remote_url: null,
                current_branch: 'main',
                local_branches: ['main'],
                is_dirty: false,
                has_unpushed_commits: false
            }
        ];
        const groups = groupRepositoriesByFolder(rootRepos);
        expect(groups).toHaveLength(1);
        expect(groups[0].folderName).toBe('Root');
    });
});
