import { useEffect, useState } from 'react';
import { useScan } from '../hooks/useScan';
import { useRepoTable } from '../hooks/table/v2/useRepoTable';
import { Button, Input } from '../components/ui/core';
import { useCommitRepoMutation, usePushRepoMutation, useDeleteRepoMutation, useBulkCommitAndPushMutation } from '../redux/api/v2/gitApi';
import { Search, RotateCcw, Rocket, GitMerge, Loader2, Folder } from 'lucide-react';
import { cn } from '../lib/utils';
import { RepoTable } from '../components/RepoTable';
import { CommitDialog } from '../components/CommitDialog';
import { DiffViewerDialog } from '../components/DiffViewerDialog';
import { BulkActionBar } from '../components/BulkActionBar';
import { Popconfirm } from '../components/ui/Popconfirm';
import { BulkResult } from '../redux/api/v2/apiResponse';

const UNIVERSAL_COMMIT_MSG = 'chore: bulk sync via GitExodus';

export const Repositories = () => {
  const { repositories, isScanning, handleScan } = useScan(true);
  
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

  const actionableCount = repositories.filter(r => r.is_dirty || r.has_unpushed_commits).length;

  return (
    <div className="p-8 space-y-6 pb-32">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              <Folder className="h-8 w-8 text-muted-foreground" />
              Repositories
          </h1>
          <p className="text-muted-foreground">Manage and track your local git projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleScan} disabled={isScanning} size="sm" variant="outline">
            <RotateCcw className={cn("mr-2 h-4 w-4", isScanning && "animate-spin")} /> {isScanning ? "Scanning..." : "Scan"}
          </Button>
          <Popconfirm
            title="Universal Commit & Push All"
            description={`This will commit and push all dirty/unpushed branches across ${actionableCount} repos. Confirm?`}
            onConfirm={handleUniversalCommitPushAll}
          >
            <Button size="sm" disabled={universalLoading || actionableCount === 0} className="gap-2 bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
              {universalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              Sync All Repos
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search repositories..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
            <Button variant={filterDirty ? "default" : "outline"} size="sm" onClick={() => setFilterDirty(!filterDirty)}>Dirty</Button>
            <Button variant={filterUnpushed ? "default" : "outline"} size="sm" onClick={() => setFilterUnpushed(!filterUnpushed)}>Unpushed</Button>
        </div>
      </div>

      <RepoTable 
        data={filteredData} isScanning={isScanning} onCommit={handleCommit} onPush={pushRepo} onDelete={deleteRepo} onViewChanges={(p) => { 
          const r = repositories.find(r => r.path === p);
          if (r) { setSelectedRepo({path: p, name: r.name }); setDiffDialogOpen(true); }
        }} 
        selectedPaths={selectedPaths} onSelectionChange={setSelectedPaths}
      />

      <BulkActionBar 
        selectedCount={selectedPaths.size} selectedPaths={Array.from(selectedPaths)} 
        onBulkCommit={handleBulkCommit} onBulkPush={handleBulkPush} onClearSelection={() => setSelectedPaths(new Set())} 
      />

      <CommitDialog isOpen={commitDialogOpen} onOpenChange={setCommitDialogOpen} onConfirm={onCommitConfirm} repoName={selectedRepo?.name || ""} />
      <DiffViewerDialog isOpen={diffDialogOpen} onOpenChange={setDiffDialogOpen} repoPath={selectedRepo?.path || ""} repoName={selectedRepo?.name || ""} />
    </div>
  );
};
