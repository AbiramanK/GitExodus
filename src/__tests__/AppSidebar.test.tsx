import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from '../components/AppSidebar';
import { renderWithProviders } from '../test/test-utils';

// Mock pageRoutes
vi.mock('../configs/pageRoutes', () => ({
  sidebarItems: [
    { title: 'Dashboard', path: '/', icon: 'LayoutDashboard' }
  ]
}));

describe('AppSidebar', () => {
  it('renders expanded by default', () => {
    renderWithProviders(<AppSidebar />);
    expect(screen.getByText('GitExodus')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('collapses when toggle button is clicked', () => {
    const { store } = renderWithProviders(<AppSidebar />);
    const toggleButton = screen.getByRole('button');
    
    fireEvent.click(toggleButton);
    
    expect(store.getState().ui.sidebarCollapsed).toBe(true);
    expect(screen.queryByText('GitExodus')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders collapsed when state is preloaded as collapsed', () => {
    renderWithProviders(<AppSidebar />, {
      preloadedState: {
        ui: { sidebarCollapsed: true }
      }
    });
    
    expect(screen.queryByText('GitExodus')).not.toBeInTheDocument();
    expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
  });
});
