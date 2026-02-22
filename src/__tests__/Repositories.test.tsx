import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { Repositories } from '../pages/Repositories';
import { renderWithProviders } from '../test/test-utils';

// Mock Popconfirm to simplify testing Delete
vi.mock('../components/ui/Popconfirm', () => ({
  Popconfirm: ({ children, onConfirm }: any) => (
    <div data-testid="popconfirm-mock" onClick={() => { onConfirm?.(); }}>
      {children}
    </div>
  )
}));

// Mock mutations and queries are handled by the store in renderWithProviders
// and the msw/global mocks in setup.ts.

describe('Repositories Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockRepo = {
    name: 'test-repo',
    path: '/path/to/test-repo',
    remote_url: 'https://github.com/test/repo',
    current_branch: 'main',
    local_branches: ['main', 'feat'],
    is_dirty: true,
    has_unpushed_commits: true,
  };

  it('renders Repositories page with header', () => {
    renderWithProviders(<Repositories />);
    expect(screen.getByText('Repositories')).toBeInTheDocument();
  });

  it('shows repositories list', () => {
    renderWithProviders(<Repositories />, {
      preloadedState: {
        repos: {
          repositories: [mockRepo],
          isScanning: false,
          scanError: null,
          scanRoots: []
        }
      }
    });
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('allows searching repositories', async () => {
    renderWithProviders(<Repositories />, {
      preloadedState: {
        repos: {
          repositories: [
            mockRepo,
            { ...mockRepo, name: 'other-repo', path: '/other' }
          ],
          isScanning: false,
          scanError: null,
          scanRoots: []
        }
      }
    });

    const searchInput = screen.getByPlaceholderText('Search repositories...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.queryByText('other-repo')).not.toBeInTheDocument();
  });

  it('filters dirty repositories', () => {
    renderWithProviders(<Repositories />, {
      preloadedState: {
        repos: {
          repositories: [
            { ...mockRepo, is_dirty: true, name: 'dirty-repo', path: '/dirty' },
            { ...mockRepo, is_dirty: false, name: 'clean-repo', path: '/clean' }
          ],
          isScanning: false,
          scanError: null,
          scanRoots: []
        }
      }
    });

    const dirtyFilter = screen.getByRole('button', { name: 'Dirty' });
    fireEvent.click(dirtyFilter);

    expect(screen.getByText('dirty-repo')).toBeInTheDocument();
    expect(screen.queryByText('clean-repo')).not.toBeInTheDocument();
  });

  it('triggers scan on button click', async () => {
    // Import at top of test to ensure we get the mocked version
    const { invoke } = await import('@tauri-apps/api/core');
    renderWithProviders(<Repositories />, {
        preloadedState: {
            repos: { repositories: [mockRepo], isScanning: false, scanError: null, scanRoots: ['/root'] }
        }
    });
    // With repositories already present, it shouldn't auto-scan.
    // We clear mock to be sure we only count the manual click
    vi.clearAllMocks();
    
    const scanButton = screen.getByRole('button', { name: /scan/i });
    fireEvent.click(scanButton);
    expect(invoke).toHaveBeenCalledWith('scan_repos', { rootPaths: ['/root'] });
  });

  it('handles universal sync click', async () => {
    const { invoke } = await import('@tauri-apps/api/core');
    renderWithProviders(<Repositories />, {
      preloadedState: {
        repos: {
          repositories: [
            { ...mockRepo, is_dirty: true, name: 'repo-to-sync', path: '/sync' }
          ],
          isScanning: false,
          scanError: null,
          scanRoots: []
        }
      }
    });

    const syncButton = screen.getByText('Sync All Repos');
    fireEvent.click(syncButton);

    // handleUniversalCommitPushAll calls bulkCommitAndPush mutation
    expect(invoke).toHaveBeenCalledWith('bulk_commit_and_push', expect.anything());
  });

  it('listens for backend events', async () => {
    const { listen } = await import('@tauri-apps/api/event');
    const { waitFor } = await import('@testing-library/react');
    
    renderWithProviders(<Repositories />, {
        preloadedState: {
            repos: { repositories: [mockRepo], isScanning: false, scanError: null, scanRoots: [] }
        }
    });
    
    await waitFor(() => {
        expect(listen).toHaveBeenCalledWith('scan-started', expect.any(Function));
        expect(listen).toHaveBeenCalledWith('repo-detected', expect.any(Function));
        expect(listen).toHaveBeenCalledWith('scan-finished', expect.any(Function));
    });
  });

  it('handles search input correctly', () => {
    renderWithProviders(<Repositories />);
    const searchInput = screen.getByPlaceholderText('Search repositories...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput).toHaveValue('test');
  });
});
