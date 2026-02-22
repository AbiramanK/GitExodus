import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';
import { renderWithProviders } from '../test/test-utils';
import React from 'react';

// Mock chart components and lucide
vi.mock('lucide-react', async () => {
    const actual = await vi.importActual('lucide-react') as any;
    return {
        ...actual,
        BarChart3: () => <span data-testid="icon-chart" />,
        RotateCcw: () => <span data-testid="icon-rotate" />,
    };
});

// Mock invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(() => Promise.resolve()),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard page with title', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('triggers scan on button click', async () => {
    const { invoke } = await import('@tauri-apps/api/core');
    renderWithProviders(<Dashboard />);
    const scanButton = screen.getByRole('button', { name: /scan/i });
    fireEvent.click(scanButton);
    expect(invoke).toHaveBeenCalledWith('scan_repos', expect.anything());
  });

  it('renders status overview', () => {
    const repoInfo = { 
      name: 'repo1', 
      path: '/p1', 
      is_dirty: true, 
      current_branch: 'master', 
      has_unpushed_commits: false,
      remote_url: 'url',
      local_branches: ['master']
    };
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        repos: {
          repositories: [repoInfo],
          isScanning: false,
          scanError: null,
          scanRoots: []
        }
      }
    });
    // The value 1 is rendered in StatusCard in a bold div
    // Use getAllByText because '1' might appear in other cards or counts
    expect(screen.getByText(/Dirty Repositories/i)).toBeInTheDocument();
    const statusCards = screen.getAllByRole('heading', { level: 3 }); // Card titles
    expect(statusCards.some(c => c.textContent === 'Dirty Repositories')).toBe(true);
  });
});
