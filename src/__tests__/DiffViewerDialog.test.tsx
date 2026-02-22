import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { DiffViewerDialog } from '../components/DiffViewerDialog';
import { renderWithProviders } from '../test/test-utils';
import React from 'react';
import * as gitApi from '../redux/api/v2/gitApi';

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

// Mock the API hooks partially
vi.mock('../redux/api/v2/gitApi', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        useGetRepoChangesQuery: vi.fn(),
        useGetFileDiffContentQuery: vi.fn(),
    };
});

describe('DiffViewerDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    repoPath: '/test/repo',
    repoName: 'test-repo',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (gitApi.useGetRepoChangesQuery as any).mockReturnValue({
        data: [{ path: 'file1.ts', status: 'modified' }],
        isLoading: false,
        error: null,
    });
    
    (gitApi.useGetFileDiffContentQuery as any).mockReturnValue({
        data: { original_content: 'old', modified_content: 'new' },
        isFetching: false,
    });
  });

  it('renders correctly', async () => {
    renderWithProviders(<DiffViewerDialog {...defaultProps} />);
    const title = await screen.findByText(/Repository Changes/i);
    expect(title).toBeInTheDocument();
  });
});
