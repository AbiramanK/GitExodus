import { useEffect, useState } from 'react';
import { useScan } from '../hooks/useScan';
import { useRepoTable } from '../hooks/table/v2/useRepoTable';
import { Button, Input } from '../components/ui/core';
import { 
  useCommitRepoMutation, 
  usePushRepoMutation, 
  useDeleteRepoMutation, 
  useBulkCommitAndPushMutation,
  useDiscardAllChangesMutation
} from '../redux/api/v2/gitApi';
import { Search, RotateCcw, Rocket, GitMerge, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { RepoTable } from '../components/RepoTable';
import { RepoTreeView } from '../components/RepoTreeView';
import { ExplorerTreeView } from '../components/ExplorerTreeView';
import { groupRepositoriesByFolder, buildExplorerTree } from '../lib/repoUtils';
import { CommitDialog } from '../components/CommitDialog';
import { DiffViewerDialog } from '../components/DiffViewerDialog';
import { BulkActionBar } from '../components/BulkActionBar';
import { Popconfirm } from '../components/ui/Popconfirm';
import { BulkResult } from '../redux/api/v2/apiResponse';
import { LayoutList, LayoutGrid, Folders } from 'lucide-react';

const UNIVERSAL_COMMIT_MSG = 'chore: bulk sync via GitExodus';

export const Repositories = () => {
  const { repositories, isScanning, handleScan } = useScan(true);
  const [viewMode, setViewMode] = useState<'list' | 'tree' | 'explorer'>('list');
  
  const [commitRepo] = useCommitRepoMutation();
  const [pushRepo] = usePushRepoMutation();
  const [deleteRepo] = useDeleteRepoMutation();
  const [bulkCommitAndPush] = useBulkCommitAndPushMutation();

  const { filteredData, filterDirty, setFilterDirty, filterUnpushed, setFilterUnpushed, searchTerm, setSearchTerm } = useRepoTable(repositories);

  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  useEffect(() => { setSelectedPaths(new Set()); }, [repositories]);

  const [universalLoading, setUniversalLoading] = useState(false);
  const [universalResult, setUniversalResult] = useState<BulkResult | null>(null);

  const handleUniversalCommitPushAll = async () => {
    const allPaths = repositories.filter(r => r.is_dirty || r.has_unpushed_commits).map(r => r.path);
    if (!allPaths.length) return;
    setUniversalLoading(true);
    try {
      const result = await bulkCommitAndPush({ paths: allPaths, message: UNIVERSAL_COMMIT_MSG }).unwrap();
      setUniversalResult(result);
    } catch (e) { console.error(e); } finally {
      setUniversalLoading(false);
      setTimeout(() => setUniversalResult(null), 8000);
    }
  };

  const handleBulkCommit = async (paths: string[], message: string) => {
    try { return await bulkCommitAndPush({ paths, message }).unwrap(); } catch { return undefined; }
  };

  const handleBulkPush = (paths: string[]) => { paths.forEach(path => pushRepo(path)); };

  const [commitDialogOpen, setCommitDialogOpen] = useState(false);
  const [diffDialogOpen, setDiffDialogOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<{ path: string, name: string } | null>(null);

  const handleCommit = (path: string) => {
      const r = repositories.find(r => r.path === path);
      if (r) { setSelectedRepo({ path, name: r.name }); setCommitDialogOpen(true); }
  };
  const onCommitConfirm = (message: string) => {
      if (selectedRepo) { commitRepo({ path: selectedRepo.path, message }); setCommitDialogOpen(false); }
  };

  // Wrapper functions for RepoTable/TreeView props
  const [discardAll] = useDiscardAllChangesMutation();
  const handleDiscardAll = (path: string) => discardAll(path);

  const handlePush = (path: string) => pushRepo(path);
  const handleDelete = (path: string) => deleteRepo(path);
  const handleViewChanges = (p: string) => { 
    const r = repositories.find(r => r.path === p);
    if (r) { setSelectedRepo({path: p, name: r.name }); setDiffDialogOpen(true); }
  };

  return (
    <div className="p-8 space-y-6 pb-32">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-8 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleScan} disabled={isScanning} className="shrink-0" title="Refresh">
            <RotateCcw className={cn("h-4 w-4", isScanning && "animate-spin")} />
          </Button>
          
          <div className="flex items-center border rounded-md p-1 bg-muted/20 ml-2">
            <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
                title="List View"
            >
                <LayoutList className="h-4 w-4" />
            </Button>
            <Button 
                variant={viewMode === 'tree' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('tree')}
                title="Grouped View"
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
                variant={viewMode === 'explorer' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('explorer')}
                title="Explorer View"
            >
                <Folders className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="outline" 
            onClick={() => { setFilterDirty(!filterDirty); setFilterUnpushed(false); }}
            className={cn(filterDirty && "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20")}
          >
            Dirty ({repositories.filter(r => r.is_dirty).length})
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { setFilterUnpushed(!filterUnpushed); setFilterDirty(false); }}
            className={cn(filterUnpushed && "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20")}
          >
            Unpushed ({repositories.filter(r => r.has_unpushed_commits).length})
          </Button>
          <Popconfirm
             title="Bulk Commit & Push"
             description="This will commit (if dirty) and push all changed repositories using the universal message."
             onConfirm={handleUniversalCommitPushAll}
          >
             <Button variant="default" className="bg-primary text-primary-foreground">
               {universalLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Rocket className="h-4 w-4 mr-2" />}
               Sync All
             </Button>
          </Popconfirm>
        </div>
      </div>

      {universalResult && (
        <div className={`p-3 rounded-md border flex items-center gap-3 text-sm ${universalResult.failed === 0 ? "bg-green-500/5 border-green-500/20 text-green-600 font-medium" : "bg-red-500/5 border-red-500/20 text-red-600 font-medium"}`}>
          <GitMerge className="h-4 w-4" />
          <span>Universal Sync: {universalResult.succeeded}/{universalResult.total} repos succeeded.</span>
        </div>
      )}

      <div className="relative min-h-100">
        {viewMode === 'list' ? (
            <RepoTable 
                data={filteredData} 
                isScanning={isScanning}
                onCommit={handleCommit}
                onPush={handlePush}
                onDelete={handleDelete}
                onViewChanges={handleViewChanges}
                onDiscardAll={handleDiscardAll}
                selectedPaths={selectedPaths}
                onSelectionChange={setSelectedPaths}
            />
        ) : viewMode === 'tree' ? (
            <RepoTreeView 
                groups={groupRepositoriesByFolder(filteredData)}
                isScanning={isScanning}
                onCommit={handleCommit}
                onPush={handlePush}
                onDelete={handleDelete}
                onViewChanges={handleViewChanges}
                onDiscardAll={handleDiscardAll}
                selectedPaths={selectedPaths}
                onSelectionChange={setSelectedPaths}
            />
        ) : (
            <ExplorerTreeView 
                rootNode={buildExplorerTree(filteredData)}
                isScanning={isScanning}
                onCommit={handleCommit}
                onPush={handlePush}
                onDelete={handleDelete}
                onViewChanges={handleViewChanges}
                onDiscardAll={handleDiscardAll}
                selectedPaths={selectedPaths}
                onSelectionChange={setSelectedPaths}
            />
        )}
      </div>

      <BulkActionBar 
        selectedCount={selectedPaths.size} selectedPaths={Array.from(selectedPaths)} 
        onBulkCommit={handleBulkCommit} onBulkPush={handleBulkPush} onClearSelection={() => setSelectedPaths(new Set())} 
      />

      <CommitDialog isOpen={commitDialogOpen} onOpenChange={setCommitDialogOpen} onConfirm={onCommitConfirm} repoName={selectedRepo?.name || ""} />
      <DiffViewerDialog isOpen={diffDialogOpen} onOpenChange={setDiffDialogOpen} repoPath={selectedRepo?.path || ""} repoName={selectedRepo?.name || ""} />
    </div>
  );
};
