
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { GitLogDialog } from '../components/GitLogDialog';
import { renderWithProviders } from '../test/test-utils';
import * as gitApi from '../redux/api/v2/gitApi';

vi.mock('../redux/api/v2/gitApi', async () => {
    const actual = await vi.importActual('../redux/api/v2/gitApi');
    return {
        ...actual,
        useGetRepoLogQuery: vi.fn(),
        useGetRepoBranchesQuery: vi.fn(),
    };
});

describe('GitLogDialog', () => {
    const mockLogs = [
        {
            id: 'abcdef123456',
            message: 'feat: initial commit',
            author: 'John Doe',
            time: 1709568000,
            branches: ['HEAD', 'main']
        }
    ];

    const mockBranches = [
        {
            name: 'main',
            is_remote: false,
            is_head: true,
            upstream: 'origin/main',
            ahead: 1,
            behind: 0
        },
        {
            name: 'origin/main',
            is_remote: true,
            is_head: false,
            upstream: null,
            ahead: 0,
            behind: 0
        }
    ];

    beforeEach(() => {
        vi.mocked(gitApi.useGetRepoLogQuery).mockReturnValue({
            data: mockLogs,
            isLoading: false,
            error: null,
        } as any);
        vi.mocked(gitApi.useGetRepoBranchesQuery).mockReturnValue({
            data: mockBranches,
            isLoading: false,
            error: null,
        } as any);
    });

    it('renders commit history by default', () => {
        renderWithProviders(<GitLogDialog repoPath="/test/path" repoName="test-repo" onClose={vi.fn()} />);
        expect(screen.getByText('feat: initial commit')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('main')).toBeInTheDocument();
    });

    it('switches to branches tab', () => {
        renderWithProviders(<GitLogDialog repoPath="/test/path" repoName="test-repo" onClose={vi.fn()} />);
        const branchesBtn = screen.getByRole('button', { name: /Branches/i });
        fireEvent.click(branchesBtn);
        
        expect(screen.getByText('origin/main')).toBeInTheDocument();
        expect(screen.getByText('Tracking origin/main')).toBeInTheDocument();
    });

    it('filters branches by search', () => {
        renderWithProviders(<GitLogDialog repoPath="/test/path" repoName="test-repo" onClose={vi.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: /Branches/i }));
        
        const searchInput = screen.getByPlaceholderText(/Search branches.../i);
        fireEvent.change(searchInput, { target: { value: 'origin' } });
        
        expect(screen.getByText('origin/main')).toBeInTheDocument();
        expect(screen.queryByText('Current')).not.toBeInTheDocument(); // 'main' has 'Current' badge
    });

    it('renders loading and error states', () => {
        vi.mocked(gitApi.useGetRepoLogQuery).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        } as any);
        
        renderWithProviders(<GitLogDialog repoPath="/test/path" repoName="test-repo" onClose={vi.fn()} />);
        expect(screen.getByText(/Retrieving history/i)).toBeInTheDocument();
    });

    it('triggers onClose when close button is clicked', () => {
        vi.useFakeTimers();
        const onClose = vi.fn();
        renderWithProviders(<GitLogDialog repoPath="/test/path" repoName="test-repo" onClose={onClose} />);
        
        const closeBtn = screen.getByRole('button', { name: /Close Panel/i });
        fireEvent.click(closeBtn);
        
        vi.advanceTimersByTime(400);
        expect(onClose).toHaveBeenCalled();
        vi.useRealTimers();
    });
});
