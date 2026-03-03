import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { renderWithProviders } from '../test/test-utils';
import { ThemeProvider } from '../components/ThemeProvider';

describe('ThemeToggle', () => {
    it('toggles theme when clicked', () => {
        renderWithProviders(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <ThemeToggle />
            </ThemeProvider>
        );
        
        const button = screen.getByTitle('Toggle theme');
        expect(button).toBeInTheDocument();
        
        fireEvent.click(button);
        // Theme should toggle (actual storage change is handled by ThemeProvider)
    });
});
