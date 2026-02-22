import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('provides default theme', () => {
    render(
      <ThemeProvider defaultTheme="system" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('system');
  });

  it('allows changing theme', async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    const darkButton = screen.getByText('Set Dark');
    fireEvent.click(darkButton);

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(localStorage.getItem('test-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
