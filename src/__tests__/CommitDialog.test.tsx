import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommitDialog } from '../components/CommitDialog';

describe('CommitDialog', () => {
    const mockProps = {
        isOpen: true,
        onOpenChange: vi.fn(),
        onConfirm: vi.fn(),
        repoName: 'test-repo',
    };

    it('renders with repo name', () => {
        render(<CommitDialog {...mockProps} />);
        expect(screen.getByText('test-repo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Commit message...')).toBeInTheDocument();
    });

    it('calls onConfirm with message on submit', () => {
        render(<CommitDialog {...mockProps} />);
        const input = screen.getByPlaceholderText('Commit message...');
        fireEvent.change(input, { target: { value: 'custom message' } });
        
        const commitBtn = screen.getByRole('button', { name: /commit/i });
        fireEvent.click(commitBtn);
        
        expect(mockProps.onConfirm).toHaveBeenCalledWith('custom message');
        expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange(false) when Cancel is clicked', () => {
        render(<CommitDialog {...mockProps} />);
        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelBtn);
        expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it('disables commit button when message is empty', () => {
        render(<CommitDialog {...mockProps} />);
        const input = screen.getByPlaceholderText('Commit message...');
        fireEvent.change(input, { target: { value: '   ' } });
        
        const commitBtn = screen.getByRole('button', { name: /commit/i });
        expect(commitBtn).toBeDisabled();
    });
});
