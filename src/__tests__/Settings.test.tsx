import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Settings } from '../pages/Settings';
import { renderWithProviders } from '../test/test-utils';

// Mock the dialog plugin
vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
}));

describe('Settings Page', () => {
    it('renders settings sections', () => {
        renderWithProviders(<Settings />);
        expect(screen.getByText(/Settings/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Roots/i).length).toBeGreaterThan(0);
    });

    it('displays scan roots from state and handles removal', () => {
        const preloadedState = {
            repos: {
                scanRoots: ['/path/to/root1'],
                repositories: [],
                isScanning: false,
                lastScan: null
            }
        };
        renderWithProviders(<Settings />, { preloadedState: preloadedState as any });
        expect(screen.getByText(/\/path\/to\/root1/i)).toBeInTheDocument();
        
        const deleteBtn = screen.getByTitle(/Delete/i);
        fireEvent.click(deleteBtn);
    });

    it('handles adding a scan root', async () => {
        const { open } = await import('@tauri-apps/plugin-dialog');
        (open as any).mockResolvedValue('/new/root');

        renderWithProviders(<Settings />);
        const addBtn = screen.getByText(/Add Root/i);
        fireEvent.click(addBtn);

        await waitFor(() => {
            expect(open).toHaveBeenCalled();
        });
    });
});
