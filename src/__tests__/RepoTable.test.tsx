import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { RepoTable } from '../components/RepoTable';
import { renderWithProviders } from '../test/test-utils';

// Mock OpenWithMenu to simplify RepoTable tests
vi.mock('../components/OpenWithMenu', () => ({
  OpenWithMenu: () => <div data-testid="open-with-menu">OpenWith</div>
}));

// Mock Popconfirm to simplify testing Delete
vi.mock('../components/ui/Popconfirm', () => ({
  Popconfirm: ({ children, onConfirm }: any) => (
    <div data-testid="popconfirm-mock" onClick={onConfirm}>
      {children}
    </div>
  )
}));

const mockRepos: any[] = [
  { name: 'repo1', path: '/p1', current_branch: 'master', is_dirty: true, has_unpushed_commits: false },
  { name: 'repo2', path: '/p2', current_branch: 'main', is_dirty: false, has_unpushed_commits: true },
  { name: 'repo3', path: '/p3', current_branch: 'dev', is_dirty: false, has_unpushed_commits: false },
];

describe('RepoTable', () => {
  const onCommit = vi.fn();
  const onPush = vi.fn();
  const onDelete = vi.fn();
  const onViewChanges = vi.fn();
  const onSelectionChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders progress row when scanning and empty', () => {
    renderWithProviders(<RepoTable data={[]} isScanning={true} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    expect(screen.getByText('Scanning for repositories...')).toBeInTheDocument();
  });

  it('renders empty row when not scanning and empty', () => {
    renderWithProviders(<RepoTable data={[]} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    expect(screen.getByText('No repositories found.')).toBeInTheDocument();
  });

  it('renders repository rows with status badges', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('Dirty')).toBeInTheDocument();
    expect(screen.getByText('Unpushed')).toBeInTheDocument();
    expect(screen.getByText('Clean')).toBeInTheDocument();
  });

  it('handles row selection toggle', () => {
    const selected = new Set(['/p1']);
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} selectedPaths={selected} onSelectionChange={onSelectionChange} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    // checkbox[0] is Select All, [1] is repo1, [2] is repo2...
    fireEvent.click(checkboxes[2]); // Toggle repo2
    expect(onSelectionChange).toHaveBeenCalled();
    const callSet = onSelectionChange.mock.calls[0][0];
    expect(callSet.has('/p1')).toBe(true);
    expect(callSet.has('/p2')).toBe(true);
  });

  it('handles select all toggle', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    
    const selectAll = screen.getByLabelText('Select all');
    fireEvent.click(selectAll);
    expect(onSelectionChange).toHaveBeenCalled();
    const callSet = onSelectionChange.mock.calls[0][0];
    expect(callSet.size).toBe(mockRepos.length);
  });

  it('handles action button clicks', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    
    // Test Commit button
    const commitButtons = screen.getAllByTitle('Commit');
    fireEvent.click(commitButtons[0]);
    expect(onCommit).toHaveBeenCalledWith('/p1');

    // Test Push button
    const pushButtons = screen.getAllByTitle('Push');
    fireEvent.click(pushButtons[1]);
    expect(onPush).toHaveBeenCalledWith('/p2');

    // Test Delete button via Popconfirm mock
    const trashButtons = screen.getAllByTitle('Delete');
    fireEvent.click(trashButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('/p1');

    // Test View Changes
    const viewButtons = screen.getAllByTitle('View Changes');
    fireEvent.click(viewButtons[0]);
    expect(onViewChanges).toHaveBeenCalledWith('/p1');
  });
});
