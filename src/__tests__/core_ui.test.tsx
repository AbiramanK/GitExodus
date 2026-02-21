import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Input, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/core';

describe('Core UI Components', () => {
  describe('Button', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles clicks', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    it('renders and accepts value', () => {
      render(<Input placeholder="test-input" />);
      const input = screen.getByPlaceholderText('test-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'hello' } });
      expect(input.value).toBe('hello');
    });
  });

  describe('Badge', () => {
    it('renders with content', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  describe('Table', () => {
    it('renders table structure', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Cell')).toBeInTheDocument();
    });
  });
});
