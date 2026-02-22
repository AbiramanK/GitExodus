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
});
