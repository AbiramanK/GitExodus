import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { FileDiffCard } from '../components/FileDiffCard';
import { renderWithProviders } from '../test/test-utils';
import * as gitApi from '../redux/api/v2/gitApi';

// Mock the diff viewer
vi.mock('react-diff-viewer-continued', () => ({
  default: (props: any) => (
    <div data-testid="diff-viewer-mock">
      <div data-testid="old-value">{props.oldValue}</div>
      <div data-testid="new-value">{props.newValue}</div>
    </div>
  )
}));

describe('FileDiffCard Component', () => {
  const defaultProps = {
    repoPath: '/test/repo',
    filePath: 'src/app.ts',
    status: 'modified',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.spyOn(gitApi, 'useGetFileDiffContentQuery').mockReturnValue({
        data: undefined,
        isFetching: true,
    } as any);

    renderWithProviders(<FileDiffCard {...defaultProps} />);
    expect(screen.getByText(/Loading diff.../i)).toBeInTheDocument();
  });

  it('renders diff content correctly', async () => {
    vi.spyOn(gitApi, 'useGetFileDiffContentQuery').mockReturnValue({
        data: { original_content: 'old text', modified_content: 'new text' },
        isFetching: false,
    } as any);

    renderWithProviders(<FileDiffCard {...defaultProps} />);
    
    expect(screen.getByText('src/app.ts')).toBeInTheDocument();
    expect(screen.getByText('modified')).toBeInTheDocument();
    
    expect(screen.getByTestId('old-value')).toHaveTextContent('old text');
    expect(screen.getByTestId('new-value')).toHaveTextContent('new text');
  });

  it('renders correctly for added status', () => {
    vi.spyOn(gitApi, 'useGetFileDiffContentQuery').mockReturnValue({
        data: { original_content: '', modified_content: 'new text' },
        isFetching: false,
    } as any);

    renderWithProviders(<FileDiffCard {...defaultProps} status="added" />);
    expect(screen.getByText('added')).toBeInTheDocument();
  });

  it('renders correctly for deleted status', () => {
    vi.spyOn(gitApi, 'useGetFileDiffContentQuery').mockReturnValue({
        data: { original_content: 'old text', modified_content: '' },
        isFetching: false,
    } as any);

    renderWithProviders(<FileDiffCard {...defaultProps} status="deleted" />);
    expect(screen.getByText('deleted')).toBeInTheDocument();
  });

  it('handles empty state/error', () => {
    vi.spyOn(gitApi, 'useGetFileDiffContentQuery').mockReturnValue({
        data: null,
        isFetching: false,
    } as any);

    renderWithProviders(<FileDiffCard {...defaultProps} />);
    expect(screen.getByText(/Failed to load diff content/i)).toBeInTheDocument();
  });

  it('copies path to clipboard', async () => {
    const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    vi.spyOn(gitApi, 'useGetFileDiffContentQuery').mockReturnValue({
        data: { original_content: 'old', modified_content: 'new' },
        isFetching: false,
    } as any);

    renderWithProviders(<FileDiffCard {...defaultProps} />);
    
    const copyButton = screen.getByTitle('Copy path');
    fireEvent.click(copyButton);
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('src/app.ts');
    expect(screen.getByTestId('icon-check-mock') || screen.queryByRole('img', { name: /check/i })).toBeDefined(); 
    // Simplified check for copied state. Wait for icon change if needed.
  });
});

// Mock lucide icons for easier testing
vi.mock('lucide-react', () => ({
    FileText: () => <span />,
    Loader2: () => <span className="animate-spin" />,
    Copy: () => <span />,
    Check: () => <span data-testid="icon-check-mock" />,
}));
