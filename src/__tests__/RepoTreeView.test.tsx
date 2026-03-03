import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { RepoTreeView } from '../components/RepoTreeView';
import { RepoGroup } from '../lib/repoUtils';
import { renderWithProviders } from '../test/test-utils';

describe('RepoTreeView', () => {
    const mockGroups: RepoGroup[] = [
        {
            folderName: 'web',
            basePath: '/home/user/projects/web/',
            repositories: [
                {
                    name: 'repo1',
                    path: '/home/user/projects/web/repo1',
                    remote_url: null,
                    current_branch: 'main',
                    local_branches: ['main'],
                    is_dirty: true,
                    has_unpushed_commits: false
                }
            ]
        }
    ];

    const mockHandlers = {
        onCommit: vi.fn(),
        onPush: vi.fn(),
        onDelete: vi.fn(),
        onViewChanges: vi.fn(),
        onDiscardAll: vi.fn(),
        onSelectionChange: vi.fn()
    };

    it('renders repository groups and repositories', () => {
        renderWithProviders(
            <RepoTreeView 
                groups={mockGroups}
                isScanning={false}
                selectedPaths={new Set()}
                {...mockHandlers}
            />
        );

        expect(screen.getByText('web')).toBeInTheDocument();
        expect(screen.getByText('repo1')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // Badge count
    });

    it('toggles group collapse state', () => {
        renderWithProviders(
            <RepoTreeView 
                groups={mockGroups}
                isScanning={false}
                selectedPaths={new Set()}
                {...mockHandlers}
            />
        );

        const groupHeader = screen.getByText('web');
        fireEvent.click(groupHeader);
        
        // Repo should be hidden
        expect(screen.queryByText('repo1')).not.toBeInTheDocument();
        
        fireEvent.click(groupHeader);
        // Repo should be visible again
        expect(screen.getByText('repo1')).toBeInTheDocument();
    });

    it('triggers action handlers', () => {
        renderWithProviders(
            <RepoTreeView 
                groups={mockGroups}
                isScanning={false}
                selectedPaths={new Set()}
                {...mockHandlers}
            />
        );

        fireEvent.click(screen.getByTitle('Commit'));
        expect(mockHandlers.onCommit).toHaveBeenCalledWith('/home/user/projects/web/repo1');
    });

    it('handles selection in tree view', () => {
        renderWithProviders(
            <RepoTreeView 
                groups={mockGroups}
                isScanning={false}
                selectedPaths={new Set()}
                {...mockHandlers}
            />
        );

        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);
        expect(mockHandlers.onSelectionChange).toHaveBeenCalled();
    });
});
