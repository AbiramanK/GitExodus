import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { OpenWithMenu } from '../components/OpenWithMenu';
import { renderWithProviders } from '../test/test-utils';
import * as gitApi from '../redux/api/v2/gitApi';

// Mock the API hooks
vi.mock('../redux/api/v2/gitApi', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useGetAvailableAppsQuery: vi.fn(),
    useOpenWithMutation: vi.fn(),
    useOpenFolderMutation: vi.fn(),
  };
});

describe('OpenWithMenu', () => {
  const path = '/test/path';

  it('renders default file manager button', () => {
    (gitApi.useGetAvailableAppsQuery as any).mockReturnValue({ data: [], isLoading: false });
    (gitApi.useOpenWithMutation as any).mockReturnValue([vi.fn()]);
    (gitApi.useOpenFolderMutation as any).mockReturnValue([vi.fn()]);

    renderWithProviders(<OpenWithMenu path={path} />);
    expect(screen.getByTitle('Open in File Manager')).toBeInTheDocument();
  });

  it('shows dropdown when chevron is clicked', async () => {
    const apps = [{ id: 'code', name: 'VS Code', binary: 'code', category: 'editor' }];
    (gitApi.useGetAvailableAppsQuery as any).mockReturnValue({ data: apps, isLoading: false });
    
    renderWithProviders(<OpenWithMenu path={path} />);
    
    const chevron = screen.getAllByRole('button')[1];
    fireEvent.click(chevron);

    expect(screen.getByText('VS Code')).toBeInTheDocument();
  });

  it('calls openFolder when default file manager is clicked', () => {
    const openFolder = vi.fn();
    (gitApi.useGetAvailableAppsQuery as any).mockReturnValue({ data: [], isLoading: false });
    (gitApi.useOpenFolderMutation as any).mockReturnValue([openFolder]);

    renderWithProviders(<OpenWithMenu path={path} />);
    
    fireEvent.click(screen.getByTitle('Open in File Manager'));
    expect(openFolder).toHaveBeenCalledWith(path);
  });
});
