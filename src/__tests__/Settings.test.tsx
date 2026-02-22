import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Settings } from '../pages/Settings';
import { renderWithProviders } from '../test/test-utils';
import { open } from '@tauri-apps/plugin-dialog';

// Mock tauri-plugin-dialog
vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
}));

describe('Settings Page', () => {
  it('renders settings page with header', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders scanning roots section', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('Scanning Roots')).toBeInTheDocument();
  });

  it('allows adding a new scan root via dialog', async () => {
    const mockPath = '/mock/path';
    (open as any).mockResolvedValue(mockPath);

    renderWithProviders(<Settings />);
    
    const addButton = screen.getByText('Add Root');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(open).toHaveBeenCalled();
      expect(screen.getByText(mockPath)).toBeInTheDocument();
    });
  });

  it('allows removing a scan root', async () => {
    const mockPath = '/mock/path';
    renderWithProviders(<Settings />, {
      preloadedState: {
        repos: {
          repositories: [],
          isScanning: false,
          scanError: null,
          scanRoots: [mockPath]
        }
      }
    });

    expect(screen.getByText(mockPath)).toBeInTheDocument();
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(mockPath)).not.toBeInTheDocument();
    });
  });
});
