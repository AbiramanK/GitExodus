import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { DiffViewerDialog } from '../components/DiffViewerDialog';
import { renderWithProviders } from '../test/test-utils';
import React from 'react';

// Extreme mocking to avoid hangs
vi.mock('../components/ui/Dialog', () => ({
  Dialog: ({ children }: any) => <div data-testid="dialog-root">{children}</div>,
  DialogContent: (props: any) => <div data-testid="dialog-content" {...props} />,
  DialogHeader: (props: any) => <header {...props} />,
  DialogTitle: (props: any) => <h2 {...props} />,
  DialogDescription: (props: any) => <p {...props} />,
  DialogFooter: (props: any) => <footer {...props} />,
  DialogClose: ({ onClick }: any) => <button onClick={onClick}>Close</button>,
}));

vi.mock('lucide-react', async () => {
    const actual = await vi.importActual('lucide-react') as any;
    return {
        ...actual,
        FileCode2: () => <span data-testid="icon-filecode" />,
        Search: () => <span data-testid="icon-search" />,
        ChevronRight: () => <span data-testid="icon-chevron" />,
    };
});

vi.mock('react-diff-viewer-continued', () => ({
  default: ({ newValue, oldValue }: any) => (
    <div data-testid="diff-viewer">
      <div data-testid="old-val">{oldValue}</div>
      <div data-testid="new-val">{newValue}</div>
    </div>
  )
}));

// Mock gitApi hooks
vi.mock('../redux/api/v2/gitApi', async () => {
  const actual = await vi.importActual('../redux/api/v2/gitApi') as any;
  return {
    ...actual,
    useGetRepoChangesQuery: vi.fn(() => ({ 
        data: [{ path: 'file1.ts', status: 'modified' }], 
        isLoading: false 
    })),
    useGetFileDiffContentQuery: vi.fn((args) => ({ 
        data: args?.filePath ? { old_content: 'old', new_content: 'new', file_path: args.filePath } : null, 
        isFetching: false 
    })),
  };
});

describe('DiffViewerDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    repoPath: '/path/repo',
    repoName: 'test-repo',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    renderWithProviders(<DiffViewerDialog {...defaultProps} />);
    const title = await screen.findByText(/Repository Changes/i);
    expect(title).toBeInTheDocument();
  });

  it('shows diff when a file is selected', async () => {
    renderWithProviders(<DiffViewerDialog {...defaultProps} />);
    
    const fileItems = screen.getAllByText('file1.ts');
    fireEvent.click(fileItems[0]);
    
    await waitFor(() => {
        expect(screen.getByTestId('diff-viewer')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('old-val')).toHaveTextContent('old');
    expect(screen.getByTestId('new-val')).toHaveTextContent('new');
  });

  it('renders empty state when no file is selected', async () => {
    renderWithProviders(<DiffViewerDialog {...defaultProps} />);
    expect(screen.getByText(/Select a file to review/i)).toBeInTheDocument();
  });
});
