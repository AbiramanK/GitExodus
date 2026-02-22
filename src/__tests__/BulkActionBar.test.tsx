import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BulkActionBar } from '../components/BulkActionBar';

describe('BulkActionBar Component', () => {
  const defaultProps = {
    selectedCount: 2,
    selectedPaths: ['/path/1', '/path/2'],
    onBulkCommit: vi.fn(),
    onBulkPush: vi.fn(),
    onClearSelection: vi.fn(),
  };

  it('is not visible when selectedCount is 0', () => {
    const { container } = render(<BulkActionBar {...defaultProps} selectedCount={0} />);
    // The component uses AnimatePresence, so it might take a bit to disappear, 
    // but we check if the main container is rendered.
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when items are selected', () => {
    render(<BulkActionBar {...defaultProps} />);
    expect(screen.getByText('2 repos selected')).toBeInTheDocument();
    expect(screen.getByText('Commit')).toBeInTheDocument();
    expect(screen.getByText('Push')).toBeInTheDocument();
  });

  it('calls onClearSelection when Close icon is clicked', () => {
    render(<BulkActionBar {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]); // The X icon button is the last one in the second group
    expect(defaultProps.onClearSelection).toHaveBeenCalled();
  });

  it('opens commit dialog when Commit is clicked', () => {
    render(<BulkActionBar {...defaultProps} />);
    fireEvent.click(screen.getByText('Commit'));
    expect(screen.getByPlaceholderText('Standard commit message...')).toBeInTheDocument();
  });

  it('handles bulk commit success', async () => {
    const onBulkCommit = vi.fn().mockResolvedValue({ succeeded: 2, failed: 0, total: 2 });
    render(<BulkActionBar {...defaultProps} onBulkCommit={onBulkCommit} />);
    
    fireEvent.click(screen.getByText('Commit'));
    const input = screen.getByPlaceholderText('Standard commit message...');
    fireEvent.change(input, { target: { value: 'bulk message' } });
    fireEvent.click(screen.getByText('Confirm'));
    
    expect(onBulkCommit).toHaveBeenCalledWith(['/path/1', '/path/2'], 'bulk message');
    expect(await screen.findByText('2/2 succeeded')).toBeInTheDocument();
  });

  it('handles bulk commit failure', async () => {
    const onBulkCommit = vi.fn().mockResolvedValue({ succeeded: 1, failed: 1, total: 2 });
    render(<BulkActionBar {...defaultProps} onBulkCommit={onBulkCommit} />);
    
    fireEvent.click(screen.getByText('Commit'));
    const input = screen.getByPlaceholderText('Standard commit message...');
    fireEvent.change(input, { target: { value: 'bulk message' } });
    fireEvent.click(screen.getByText('Confirm'));
    
    expect(await screen.findByText('1/2 succeeded')).toBeInTheDocument();
  });

  it('calls onBulkPush when Push is clicked', () => {
    render(<BulkActionBar {...defaultProps} />);
    fireEvent.click(screen.getByText('Push'));
    expect(defaultProps.onBulkPush).toHaveBeenCalledWith(['/path/1', '/path/2']);
  });
});
