import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommitDialog } from '../components/CommitDialog';

describe('CommitDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    repoName: 'test-repo',
  };

  it('renders correctly when open', () => {
    render(<CommitDialog {...defaultProps} />);
    expect(screen.getByText('Commit Changes')).toBeInTheDocument();
    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Commit message...')).toBeInTheDocument();
  });

  it('calls onConfirm with message when Commit button is clicked', () => {
    render(<CommitDialog {...defaultProps} />);
    const input = screen.getByPlaceholderText('Commit message...');
    const commitButton = screen.getByRole('button', { name: /commit/i });

    fireEvent.change(input, { target: { value: 'feat: experimental feature' } });
    fireEvent.click(commitButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledWith('feat: experimental feature');
  });

  it('disables commit button when message is empty', () => {
    render(<CommitDialog {...defaultProps} />);
    const input = screen.getByPlaceholderText('Commit message...');
    const commitButton = screen.getByRole('button', { name: /commit/i });
    
    // Default message is present, so we clear it
    fireEvent.change(input, { target: { value: '' } });
    expect(commitButton).toBeDisabled();
  });
});
