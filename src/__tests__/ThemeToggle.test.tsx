import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from '../components/ThemeProvider';

describe('ThemeToggle Component', () => {
  it('renders toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('switches theme when clicked', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-toggle-theme">
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(localStorage.getItem('test-toggle-theme')).toBe('dark');
  });
});
