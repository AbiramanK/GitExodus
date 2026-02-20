import { useRepoTable } from '../hooks/table/v2/useRepoTable';
import { 
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell, 
    Button, Input, Badge 
} from '../components/ui/core';
import { useScanReposQuery, useCommitRepoMutation, usePushRepoMutation, useDeleteRepoMutation, useOpenFolderMutation } from '../redux/api/v2/gitApi';
import { Search, RotateCcw, GitCommit, ArrowUpCircle, Trash2, FolderOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export const Dashboard = () => {
  const { data: scanResult, isLoading, refetch } = useScanReposQuery("/", {
      // Hardcoded root for demo, in real app we'd let user pick
  });
  
  const [commitRepo] = useCommitRepoMutation();
  const [pushRepo] = usePushRepoMutation();
  const [deleteRepo] = useDeleteRepoMutation();
  const [openFolder] = useOpenFolderMutation();

  const {
    filteredData,
    filterDirty, setFilterDirty,
    filterUnpushed, setFilterUnpushed,
    setFilterBranch,
    searchTerm, setSearchTerm
  } = useRepoTable(scanResult?.repositories);

  const handleCommit = (path: string) => {
      commitRepo({ path, message: "Auto-commit: GitExodus system backup" });
  };

  const handlePush = (path: string) => {
      pushRepo(path);
  };

  const handleOpenFolder = (path: string) => {
      openFolder(path);
  };

  const handleDelete = (path: string) => {
      if (window.confirm("Are you sure you want to delete this repository? This cannot be undone.")) {
          deleteRepo(path);
      }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">GitExodus</h1>
          <p className="text-muted-foreground">Automated local repository management and cleanup.</p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading}>
          <RotateCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Scan System
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search repositories..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <Button 
                variant={filterDirty ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterDirty(!filterDirty)}
            >
                Dirty
            </Button>
            <Button 
                variant={filterUnpushed ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterUnpushed(!filterUnpushed)}
            >
                Unpushed
            </Button>
            <select 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => setFilterBranch(e.target.value || null)}
            >
                <option value="">All Branches</option>
                {Array.from(new Set(scanResult?.repositories.map(r => r.current_branch))).map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10">Scanning for repositories...</TableCell></TableRow>
            ) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10">No repositories found.</TableCell></TableRow>
            ) : filteredData.map((repo) => (
              <TableRow key={repo.path}>
                <TableCell>
                  <div className="font-medium">{repo.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-xs">{repo.path}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{repo.current_branch}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {repo.is_dirty && <Badge variant="destructive">Dirty</Badge>}
                    {repo.has_unpushed_commits && <Badge variant="default" className="bg-amber-600">Unpushed</Badge>}
                    {!repo.is_dirty && !repo.has_unpushed_commits && <Badge variant="outline" className="text-green-500 border-green-500">Clean</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" title="Open Folder" onClick={() => handleOpenFolder(repo.path)}>
                        <FolderOpen className="h-4 w-4" />
                    </Button>
                    {repo.is_dirty && (
                        <Button size="icon" variant="ghost" title="Commit" onClick={() => handleCommit(repo.path)}>
                            <GitCommit className="h-4 w-4" />
                        </Button>
                    )}
                    {repo.has_unpushed_commits && (
                        <Button size="icon" variant="ghost" title="Push" onClick={() => handlePush(repo.path)}>
                            <ArrowUpCircle className="h-4 w-4" />
                        </Button>
                    )}
                    {!repo.is_dirty && !repo.has_unpushed_commits && (
                        <Button size="icon" variant="ghost" title="Safe Delete" className="text-destructive" onClick={() => handleDelete(repo.path)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
