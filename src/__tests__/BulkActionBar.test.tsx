import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkActionBar } from '../components/BulkActionBar';

describe('BulkActionBar', () => {
    const mockProps = {
        selectedCount: 2,
        selectedPaths: ['/path/1', '/path/2'],
        onBulkCommit: vi.fn(),
        onBulkPush: vi.fn(),
        onClearSelection: vi.fn(),
    };

    it('renders selection count', () => {
        render(<BulkActionBar {...mockProps} />);
        expect(screen.getByText('2 repos selected')).toBeInTheDocument();
    });

    it('shows commit input when Commit is clicked', () => {
        render(<BulkActionBar {...mockProps} />);
        const commitBtn = screen.getByRole('button', { name: /^Commit$/ });
        fireEvent.click(commitBtn);
        expect(screen.getByPlaceholderText('Standard commit message...')).toBeInTheDocument();
    });

    it('calls onBulkPush when Push is clicked', () => {
        render(<BulkActionBar {...mockProps} />);
        const pushBtn = screen.getByRole('button', { name: /^Push$/ });
        fireEvent.click(pushBtn);
        expect(mockProps.onBulkPush).toHaveBeenCalledWith(['/path/1', '/path/2']);
    });

    it('calls onBulkCommit when message is entered and confirmed', async () => {
        mockProps.onBulkCommit.mockResolvedValue({ succeeded: 2, failed: 0, total: 2 });
        render(<BulkActionBar {...mockProps} />);
        
        fireEvent.click(screen.getByRole('button', { name: /^Commit$/ }));
        const input = screen.getByPlaceholderText('Standard commit message...');
        fireEvent.change(input, { target: { value: 'bulk commit' } });
        
        const confirmBtn = screen.getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmBtn);
        
        expect(mockProps.onBulkCommit).toHaveBeenCalledWith(['/path/1', '/path/2'], 'bulk commit');
        await waitFor(() => expect(screen.getByText('2/2 succeeded')).toBeInTheDocument());
    });

    it('calls onClearSelection when X is clicked', () => {
        const { container } = render(<BulkActionBar {...mockProps} />);
        const clearBtn = container.querySelector('.lucide-x')?.parentElement;
        if (clearBtn) fireEvent.click(clearBtn);
        expect(mockProps.onClearSelection).toHaveBeenCalled();
    });
});
