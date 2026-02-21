import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { RepoTable } from '../components/RepoTable';
import { renderWithProviders } from '../test/test-utils';

// Mock OpenWithMenu to simplify RepoTable tests
vi.mock('../components/OpenWithMenu', () => ({
  OpenWithMenu: () => <div data-testid="open-with-menu">OpenWith</div>
}));

const mockRepos: any[] = [
  { name: 'repo1', path: '/p1', current_branch: 'master', is_dirty: true, has_unpushed_commits: false },
  { name: 'repo2', path: '/p2', current_branch: 'main', is_dirty: false, has_unpushed_commits: true },
];

describe('RepoTable', () => {
  const onCommit = vi.fn();
  const onPush = vi.fn();
  const onDelete = vi.fn();

  it('renders progress row when scanning and empty', () => {
    renderWithProviders(<RepoTable data={[]} isScanning={true} onCommit={onCommit} onPush={onPush} onDelete={onDelete} />);
    expect(screen.getByText('Scanning for repositories...')).toBeInTheDocument();
  });

  it('renders empty row when not scanning and empty', () => {
    renderWithProviders(<RepoTable data={[]} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} />);
    expect(screen.getByText('No repositories found.')).toBeInTheDocument();
  });

  it('renders repository rows with status badges', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} />);
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
    expect(screen.getByText('Dirty')).toBeInTheDocument();
    expect(screen.getByText('Unpushed')).toBeInTheDocument();
  });

  it('handles action button clicks', () => {
    renderWithProviders(<RepoTable data={mockRepos} isScanning={false} onCommit={onCommit} onPush={onPush} onDelete={onDelete} />);
    
    // Test Commit button
    const commitButtons = screen.getAllByTitle('Commit');
    fireEvent.click(commitButtons[0]);
    expect(onCommit).toHaveBeenCalledWith('/p1');

    // Test Push button
    const pushButtons = screen.getAllByTitle('Push');
    fireEvent.click(pushButtons[1]);
    expect(onPush).toHaveBeenCalledWith('/p2');

    // Test Delete button
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('/p1');
  });
});
