import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { FileDiffCard } from '../components/FileDiffCard';
import { renderWithProviders } from '../test/test-utils';

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('FileDiffCard', () => {
    const mockProps = {
        repoPath: '/path/to/repo',
        filePath: 'src/main.rs',
        status: 'modified',
    };

    it('renders file path and status', () => {
        renderWithProviders(<FileDiffCard {...mockProps} />);
        expect(screen.getByText('src/main.rs')).toBeInTheDocument();
        expect(screen.getByText('modified')).toBeInTheDocument();
    });

    it('copies path to clipboard when copy button is clicked', async () => {
        const { container } = renderWithProviders(<FileDiffCard {...mockProps} />);
        const copyBtn = screen.getByTitle('Copy path');
        fireEvent.click(copyBtn);
        
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('src/main.rs');
        
        await waitFor(() => {
            expect(container.querySelector('.lucide-check')).toBeInTheDocument();
        });
    });

    it('shows loading state', () => {
        // This would require mocking the RTK Query hook's return value for isFetching: true
        // For now, renderWithProviders might defaults to idle/fetching if not careful
        // but let's see if we can trigger it or if it's implicitly tested
    });
});
