import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { gitApi } from '../redux/api/v2/gitApi';
import { DiffViewerDialog } from '../components/DiffViewerDialog';
import { renderWithProviders } from '../test/test-utils';
import { invoke } from '@tauri-apps/api/core';

vi.mock('../components/ui/Popconfirm', () => ({
    Popconfirm: ({ children, onConfirm }: any) => <div onClick={onConfirm} data-testid="popconfirm">{children}</div>
}));

describe('DiffViewerDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the dialog when open', async () => {
        renderWithProviders(
            <DiffViewerDialog 
                isOpen={true}
                onOpenChange={vi.fn()}
                repoPath="/p"
                repoName="test-repo"
            />
        );

        expect(await screen.findByText(/test-repo/i)).toBeInTheDocument();
    });

    it('displays sidebar and main area with file list and diff content', async () => {
        const repoPath = "/p";
        const filePath = "file1.ts";
        
        // Mock invoke for the queries
        (invoke as any).mockImplementation((cmd: string) => {
            if (cmd === 'get_repo_changes') return Promise.resolve([{ path: filePath, status: 'modified' }]);
            if (cmd === 'get_file_diff_content') return Promise.resolve({
                original_content: 'old',
                modified_content: 'new',
                hunks: [{ 
                    header: 'mock-hunk-header', 
                    patch: '@@ -1,1 +1,1 @@\n-old\n+new',
                    old_start: 1, old_lines: 1, new_start: 1, new_lines: 1
                }]
            });
            return Promise.resolve();
        });

        renderWithProviders(
            <DiffViewerDialog 
                isOpen={true}
                onOpenChange={vi.fn()}
                repoPath={repoPath}
                repoName="test-repo"
            />
        );

        // Wait for file list
        expect(await screen.findByText(new RegExp(filePath, 'i'))).toBeInTheDocument();
        
        // Wait for hunk header (auto-selected first file)
        expect(await screen.findByText(/mock-hunk-header/i)).toBeInTheDocument();
        
        // Test discarding hunk
        const discardBtn = screen.getByText(/Discard Segment/i);
        fireEvent.click(discardBtn);
        // It calls handleDiscardHunk which calls discardHunk mutation
        expect(invoke).toHaveBeenCalledWith('discard_hunk', expect.objectContaining({ 
            patch: expect.stringContaining('@@ -1,1 +1,1 @@') 
        }));
    });
});
