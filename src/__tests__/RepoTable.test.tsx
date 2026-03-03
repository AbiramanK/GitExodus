import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { RepoTable } from '../components/RepoTable';
import { renderWithProviders } from '../test/test-utils';

// Mock OpenWithMenu
vi.mock('../components/OpenWithMenu', () => ({
  OpenWithMenu: () => <div data-testid="open-with-menu">OpenWith</div>
}));

// Mock Popconfirm to execute confirm immediately
vi.mock('../components/ui/Popconfirm', () => ({
  Popconfirm: ({ children, onConfirm }: any) => (
    <div onClick={onConfirm} data-testid="popconfirm-trigger">{children}</div>
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
  const onDiscardAll = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders progress row when scanning and empty', () => {
    renderWithProviders(<RepoTable data={[]} isScanning={true} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    expect(screen.getByText(/Scanning/i)).toBeInTheDocument();
  });

  it('renders empty row when not scanning and empty', () => {
    renderWithProviders(<RepoTable data={[]} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    expect(screen.getByText('No repositories found.')).toBeInTheDocument();
  });

  it('renders repository rows with status badges', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('Dirty')).toBeInTheDocument();
    expect(screen.getByText('Unpushed')).toBeInTheDocument();
    expect(screen.getByText('Clean')).toBeInTheDocument();
  });

  it('handles row selection toggle', () => {
    const selected = new Set(['/p1']);
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={selected} onSelectionChange={onSelectionChange} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[2]);
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('handles select all toggle', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    
    const selectAll = screen.getByLabelText('Select all');
    fireEvent.click(selectAll);
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('handles action button clicks including discard and delete', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={new Set()} onSelectionChange={onSelectionChange} />);
    
    fireEvent.click(screen.getAllByTitle('Commit')[0]);
    expect(onCommit).toHaveBeenCalledWith('/p1');

    fireEvent.click(screen.getAllByTitle('Push')[1]);
    expect(onPush).toHaveBeenCalledWith('/p2');

    fireEvent.click(screen.getAllByTitle('Delete')[0]);
    expect(onDelete).toHaveBeenCalledWith('/p1');

    fireEvent.click(screen.getAllByTitle('Discard Changes')[0]);
    expect(onDiscardAll).toHaveBeenCalledWith('/p1');
  });

  it('handles selection changes', () => {
    const selected = new Set(['/p1']);
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} onViewChanges={onViewChanges} onDiscardAll={onDiscardAll} selectedPaths={selected} onSelectionChange={onSelectionChange} />);
    
    // Toggle row 2
    const checkboxes = screen.getAllByRole('checkbox'); // [all, r1, r2]
    fireEvent.click(checkboxes[2]);
    expect(onSelectionChange).toHaveBeenCalled();
    
    // Toggle all
    fireEvent.click(checkboxes[0]);
    expect(onSelectionChange).toHaveBeenCalled();
  });
});
