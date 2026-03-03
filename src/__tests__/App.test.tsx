import { describe, it, expect } from 'vitest';
import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../test/test-utils';
import { PAGE_ROUTES } from '../configs/pageRoutes';
import { invoke } from '@tauri-apps/api/core';

describe('App component', () => {
    it('renders sidebar and dashboard by default', () => {
        renderWithProviders(<App />);
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    });

    it('renders repositories page when state changes', () => {
        renderWithProviders(<App />, {
            preloadedState: { ui: { currentPage: PAGE_ROUTES.REPOSITORIES, sidebarCollapsed: false } }
        });
        expect(screen.getByText('Repositories')).toBeInTheDocument();
    });

    it('renders settings page when state changes', () => {
        renderWithProviders(<App />, {
            preloadedState: { ui: { currentPage: PAGE_ROUTES.SETTINGS, sidebarCollapsed: false } }
        });
        expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument();
    });

    it('shows exit dialog on request-exit event', async () => {
        renderWithProviders(<App />);
        
        // Wait for listener to be registered
        await waitFor(() => {
            const listeners = (globalThis as any)._tauriListeners['request-exit'];
            expect(listeners && listeners.length > 0).toBeTruthy();
        }, { timeout: 2000 });
        
        // Trigger the listener
        const listeners = (globalThis as any)._tauriListeners['request-exit'];
        act(() => {
            listeners.forEach((cb: any) => cb({}));
        });
        
        // ExitConfirmDialog.tsx: <DialogTitle className="text-xl">Exit GitExodus?</DialogTitle>
        expect(await screen.findByText(/Exit GitExodus\?/i)).toBeInTheDocument();
        
        // Exit button: Exit Application
        const confirmBtn = screen.getByRole('button', { name: /Exit Application/i });
        fireEvent.click(confirmBtn);
        expect(invoke).toHaveBeenCalledWith('exit_app');
    });

    it('renders unknown page fallback', () => {
        renderWithProviders(<App />, {
            preloadedState: { ui: { currentPage: '/unknown' as any, sidebarCollapsed: false } }
        });
        expect(screen.getByText(/COMING SOON/i)).toBeInTheDocument();
    });
});
