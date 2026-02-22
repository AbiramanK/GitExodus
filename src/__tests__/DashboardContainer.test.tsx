import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { DashboardContainer } from '../containers/DashboardContainer';
import { render } from '@testing-library/react';

describe('DashboardContainer', () => {
  it('renders the Dashboard', () => {
    render(<DashboardContainer />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });
});
