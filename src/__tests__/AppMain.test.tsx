import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../test/test-utils';
import React from 'react';

// Mock components that might cause issues
vi.mock('../components/AppSidebar', () => ({
  AppSidebar: () => <div data-testid="sidebar">Sidebar</div>
}));
vi.mock('../pages/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard</div>
}));
vi.mock('../pages/Repositories', () => ({
  Repositories: () => <div data-testid="repositories">Repositories</div>
}));
vi.mock('../pages/Settings', () => ({
  Settings: () => <div data-testid="settings">Settings</div>
}));

describe('App Component', () => {
  it('renders without crashing and shows sidebar', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        repos: { repositories: [], isScanning: false, scanError: null, scanRoots: [] },
        ui: { currentPage: 'dashboard', sidebarCollapsed: false }
      }
    });
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });
});
