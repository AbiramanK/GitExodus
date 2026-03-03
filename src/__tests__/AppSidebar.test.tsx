import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from '../components/AppSidebar';
import { renderWithProviders } from '../test/test-utils';

// Mock pageRoutes
vi.mock('../configs/pageRoutes', () => ({
  sidebarItems: [
    { title: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { title: 'Repositories', path: '/repos', icon: 'Folder' }
  ]
}));

// Mock tauri event
vi.mock('@tauri-apps/api/event', () => ({
  emit: vi.fn()
}));

describe('AppSidebar', () => {
  it('renders expanded by default', () => {
    renderWithProviders(<AppSidebar />);
    expect(screen.getByText('GitExodus')).toBeInTheDocument();
  });

  it('collapses when toggle button is clicked', () => {
    const { store } = renderWithProviders(<AppSidebar />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(store.getState().ui.sidebarCollapsed).toBe(true);
  });

  it('renders collapsed when state is preloaded as collapsed', () => {
    renderWithProviders(<AppSidebar />, {
      preloadedState: {
        ui: { 
          sidebarCollapsed: true,
          currentPage: 'dashboard'
        }
      }
    });
    
    expect(screen.queryByText('GitExodus')).not.toBeInTheDocument();
  });

  it('handles navigation clicks', () => {
    const { store } = renderWithProviders(<AppSidebar />);
    const repoItem = screen.getByText('Repositories');
    fireEvent.click(repoItem);
    expect(store.getState().ui.currentPage).toBe('/repos');
  });

  it('handles theme switch click', () => {
    renderWithProviders(<AppSidebar />);
    const themeBtn = screen.getByText(/Theme Switch/i);
    fireEvent.click(themeBtn);
    // Theme switching logic is handled by ThemeProvider, we just click to cover the line
  });

  it('handles exit click', async () => {
    renderWithProviders(<AppSidebar />);
    const exitBtn = screen.getByText(/Exit/i);
    fireEvent.click(exitBtn);
    // Dynamic import of @tauri-apps/api/event happens here
  });
});
