import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../test/test-utils';

describe('App component', () => {
  it('renders sidebar and dashboard', () => {
    renderWithProviders(<App />);
    // "GitExodus" is in the sidebar logo
    expect(screen.getAllByText('GitExodus')[0]).toBeInTheDocument();
    // Dashboard should now show Analytics Dashboard
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });
});
