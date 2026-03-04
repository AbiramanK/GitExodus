
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Repositories } from '../pages/Repositories';
import { renderWithProviders } from '../test/test-utils';
import * as useScanHook from '../hooks/useScan';

vi.mock('../components/DiffViewerDialog', () => ({
    DiffViewerDialog: ({ repoName, isOpen }: any) => isOpen ? <div data-testid="diff-dialog">{repoName}</div> : null
}));

describe('Repositories Page', () => {
    it('renders page title and controls', () => {
        renderWithProviders(<Repositories />);
        expect(screen.getByText(/Repositories/i)).toBeInTheDocument();
    });

    it('toggles view mode buttons', () => {
        renderWithProviders(<Repositories />);
        const listBtn = screen.getByTitle('List View');
        const treeBtn = screen.getByTitle('Grouped View');
        
        fireEvent.click(treeBtn);
        fireEvent.click(listBtn);
    });

    it('triggers row actions', async () => {
        const repo = { name: 'repo-to-test', path: '/test/path', current_branch: 'main', is_dirty: true, has_unpushed_commits: true, remote_url: '', local_branches: [] };
        
        vi.spyOn(useScanHook, 'useScan').mockReturnValue({
            repositories: [repo],
            isScanning: false,
            handleScan: vi.fn(),
            scanRoots: []
        });

        renderWithProviders(<Repositories />);
        expect(await screen.findByText('repo-to-test')).toBeInTheDocument();
        
        const commitBtns = await screen.findAllByTitle('Commit');
        fireEvent.click(commitBtns[0]);
        // Trigger commit confirmation
        const commitMsgInput = screen.getByPlaceholderText(/Commit message.../i);
        fireEvent.change(commitMsgInput, { target: { value: 'test commit' } });
        const confirmBtn = screen.getByText('Commit', { selector: 'button' });
        fireEvent.click(confirmBtn);
        
        const viewBtns = await screen.findAllByTitle('View Changes');
        fireEvent.click(viewBtns[0]);
        expect(await screen.findByTestId('diff-dialog')).toBeInTheDocument();

        const deleteBtns = await screen.findAllByTitle('Delete');
        fireEvent.click(deleteBtns[0]);
    });

    it('handles filters and search', async () => {
        const repo = { name: 'dirty-repo', path: '/p1', current_branch: 'main', is_dirty: true, has_unpushed_commits: false, remote_url: '', local_branches: [] };
        vi.spyOn(useScanHook, 'useScan').mockReturnValue({
            repositories: [repo],
            isScanning: false,
            handleScan: vi.fn(),
            scanRoots: []
        });

        renderWithProviders(<Repositories />);
        
        // Test search
        const searchInput = screen.getByPlaceholderText(/Search repositories.../i);
        fireEvent.change(searchInput, { target: { value: 'dirty' } });
        
        // Test Refresh/Scan
        const refreshBtn = screen.getByTitle('Refresh');
        fireEvent.click(refreshBtn);

        // Test Filters
        const dirtyFilter = screen.getByRole('button', { name: /Dirty/i });
        fireEvent.click(dirtyFilter);
        
        const unpushedFilter = screen.getByRole('button', { name: /Unpushed/i });
        fireEvent.click(unpushedFilter);
    });

    it('handles bulk selection and action bar', async () => {
        const repo1 = { name: 'r1', path: '/p1', current_branch: 'main', is_dirty: true, has_unpushed_commits: false, remote_url: '', local_branches: [] };
        const repo2 = { name: 'r2', path: '/p2', current_branch: 'main', is_dirty: true, has_unpushed_commits: false, remote_url: '', local_branches: [] };
        
        vi.spyOn(useScanHook, 'useScan').mockReturnValue({
            repositories: [repo1, repo2],
            isScanning: false,
            handleScan: vi.fn(),
            scanRoots: []
        });

        renderWithProviders(<Repositories />);
        
        expect(await screen.findByText('r1')).toBeInTheDocument();
        
        const selectAll = await screen.findByLabelText(/Select all/i);
        fireEvent.click(selectAll);
        
        expect(await screen.findByText(/2 repos selected/i)).toBeInTheDocument();
        
        const clearBtn = screen.getByTitle(/Clear Selection/i);
        fireEvent.click(clearBtn);
        
        await waitFor(() => {
            expect(screen.queryByText(/repos selected/i)).not.toBeInTheDocument();
        });

        const syncAllBtn = screen.getByRole('button', { name: /Sync All/i });
        fireEvent.click(syncAllBtn);
    });
});
