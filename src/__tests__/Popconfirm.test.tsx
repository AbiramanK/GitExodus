import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { Popconfirm } from '../components/ui/Popconfirm';
import { renderWithProviders } from '../test/test-utils';

vi.mock('../components/ui/core', async () => {
    const actual = await vi.importActual('../components/ui/core');
    return {
        ...actual,
        Popover: ({ children, open }: any) => <div>{children}</div>,
        PopoverTrigger: ({ children }: any) => <div>{children}</div>,
        PopoverContent: ({ children }: any) => <div>{children}</div>,
    };
});

describe('Popconfirm', () => {
  it('renders children', () => {
    renderWithProviders(
      <Popconfirm title="Title" onConfirm={vi.fn()}>
        <button>Click me</button>
      </Popconfirm>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows popover content when clicked', async () => {
    const onConfirm = vi.fn();
    renderWithProviders(
      <Popconfirm title="Confirm?" description="Sure?" onConfirm={onConfirm}>
        <button>Delete</button>
      </Popconfirm>
    );
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
    expect(screen.getByText('Sure?')).toBeInTheDocument();
    
    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('closes when cancel is clicked', () => {
    renderWithProviders(
      <Popconfirm title="Confirm?" onConfirm={vi.fn()}>
        <button>Delete</button>
      </Popconfirm>
    );
    
    fireEvent.click(screen.getByText('Delete'));
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    
    expect(screen.queryByText('Confirm?')).not.toBeInTheDocument();
  });
});
