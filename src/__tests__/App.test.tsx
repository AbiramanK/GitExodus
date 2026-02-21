import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../test/test-utils';

describe('App component', () => {
  it('renders sidebar and dashboard', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('GitExodus')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search repositories...')).toBeInTheDocument();
  });
});
