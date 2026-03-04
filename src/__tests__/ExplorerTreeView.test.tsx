
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ExplorerTreeView } from '../components/ExplorerTreeView';
import { renderWithProviders } from '../test/test-utils';
import { ExplorerNode } from '../lib/repoUtils';

vi.mock('../components/GitLogDialog', () => ({
    GitLogDialog: () => <div data-testid="git-log-dialog">Git Log Dialog</div>
}));

vi.mock('../components/OpenWithMenu', () => ({
    OpenWithMenu: () => <div data-testid="open-with-menu">Open With</div>
}));

vi.mock('../components/ui/Popconfirm', () => ({
    Popconfirm: ({ children, onConfirm }: any) => (
        <div onClick={onConfirm} data-testid="popconfirm">{children}</div>
    )
}));

describe('ExplorerTreeView', () => {
    const mockRepo = {
        name: 'test-repo',
        path: '/path/to/repo',
        current_branch: 'main',
        is_dirty: true,
        has_unpushed_commits: true,
        remote_url: '',
        local_branches: []
    };

    const mockRoot: ExplorerNode = {
        name: 'Root',
        type: 'folder',
        path: 'Root',
        children: [
            {
                name: 'folder1',
                type: 'folder',
                path: 'Root/folder1',
                children: [
                    {
                        name: 'test-repo',
                        type: 'repo',
                        path: '/path/to/repo',
                        children: [],
                        repo: mockRepo
                    }
                ]
            }
        ]
    };

    const defaultProps = {
        rootNode: mockRoot,
        isScanning: false,
        onCommit: vi.fn(),
        onPush: vi.fn(),
        onDelete: vi.fn(),
        onViewChanges: vi.fn(),
        onDiscardAll: vi.fn(),
        selectedPaths: new Set<string>(),
        onSelectionChange: vi.fn()
    };

    it('renders the tree structure', async () => {
        renderWithProviders(<ExplorerTreeView {...defaultProps} />);
        expect(screen.getByText('folder1')).toBeInTheDocument();
        // Expand All to see repo
        fireEvent.click(screen.getByText('Expand All'));
        expect(await screen.findByText('test-repo')).toBeInTheDocument();
        expect(screen.getByText('main')).toBeInTheDocument();
    });

    it('toggles folder expansion', () => {
        renderWithProviders(<ExplorerTreeView {...defaultProps} />);
        const folder = screen.getByText('folder1');
        fireEvent.click(folder);
    });

    it('handles "Expand All" and "Collapse All"', () => {
        renderWithProviders(<ExplorerTreeView {...defaultProps} />);
        const expandBtn = screen.getByText('Expand All');
        const collapseBtn = screen.getByText('Collapse All');
        
        fireEvent.click(expandBtn);
        fireEvent.click(collapseBtn);
    });

    it('handles selection changes', async () => {
        const onSelectionChange = vi.fn();
        renderWithProviders(<ExplorerTreeView {...defaultProps} onSelectionChange={onSelectionChange} />);
        
        // Expand All to see repo checkbox
        fireEvent.click(screen.getByText('Expand All'));
        
        const checkboxes = await screen.findAllByRole('checkbox');
        // Index 1 should be the repo checkbox
        fireEvent.click(checkboxes[1]);
        expect(onSelectionChange).toHaveBeenCalled();
    });

    it('triggers repo actions', async () => {
        const onCommit = vi.fn();
        const onPush = vi.fn();
        const onDelete = vi.fn();
        const onViewChanges = vi.fn();
        const onDiscardAll = vi.fn();

        renderWithProviders(
            <ExplorerTreeView 
                {...defaultProps} 
                onCommit={onCommit} 
                onPush={onPush} 
                onDelete={onDelete} 
                onViewChanges={onViewChanges} 
                onDiscardAll={onDiscardAll} 
            />
        );
        
        // Expand All to reveal the repo
        fireEvent.click(screen.getByText('Expand All'));
        
        // Commit
        fireEvent.click(screen.getAllByTitle('Commit')[0]);
        expect(onCommit).toHaveBeenCalledWith('/path/to/repo');

        // Push
        fireEvent.click(screen.getAllByTitle('Push')[0]);
        expect(onPush).toHaveBeenCalledWith('/path/to/repo');

        // View Changes
        fireEvent.click(screen.getAllByTitle('View Changes')[0]);
        expect(onViewChanges).toHaveBeenCalledWith('/path/to/repo');

        // Discard All (inside Popconfirm)
        fireEvent.click(screen.getAllByTitle('Discard Changes')[0]);
        expect(onDiscardAll).toHaveBeenCalledWith('/path/to/repo');

        // Delete (inside Popconfirm)
        fireEvent.click(screen.getAllByTitle('Delete')[0]);
        expect(onDelete).toHaveBeenCalledWith('/path/to/repo');
    });

    it('shows scanning state', () => {
        renderWithProviders(<ExplorerTreeView {...defaultProps} isScanning={true} rootNode={{ name: 'Root', type: 'folder', path: 'Root', children: [] }} />);
        expect(screen.getByText(/Indexing/i)).toBeInTheDocument();
    });

    it('shows empty state', () => {
        renderWithProviders(<ExplorerTreeView {...defaultProps} rootNode={{ name: 'Root', type: 'folder', path: 'Root', children: [] }} />);
        expect(screen.getByText(/No repositories found/i)).toBeInTheDocument();
    });
});
