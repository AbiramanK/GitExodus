import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popconfirm } from '../components/ui/Popconfirm';

describe('Popconfirm Component', () => {
  it('renders trigger element', () => {
    render(
      <Popconfirm title="Delete?" onConfirm={() => {}}>
        <button>Trigger</button>
      </Popconfirm>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('shows dialog when trigger is clicked', () => {
    render(
      <Popconfirm title="Are you sure?" onConfirm={() => {}}>
        <button>Trigger</button>
      </Popconfirm>
    );
    
    fireEvent.click(screen.getByText('Trigger'));
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <Popconfirm title="Confirm?" onConfirm={onConfirm}>
        <button>Trigger</button>
      </Popconfirm>
    );
    
    fireEvent.click(screen.getByText('Trigger'));
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('closes dialog when cancel is clicked', () => {
    render(
      <Popconfirm title="Confirm?" onConfirm={() => {}}>
        <button>Trigger</button>
      </Popconfirm>
    );
    
    fireEvent.click(screen.getByText('Trigger'));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(screen.queryByText('Confirm?')).not.toBeInTheDocument();
  });
});
