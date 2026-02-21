import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { RootState } from '../redux/store';
import { startScan, addRepo, finishScan, setScanError } from '../redux/slices/repoSlice';
import { useRepoTable } from '../hooks/table/v2/useRepoTable';
import { 
    Button, Input, Select 
} from '../components/ui/core';
import { useCommitRepoMutation, usePushRepoMutation, useDeleteRepoMutation } from '../redux/api/v2/gitApi';
import { Search, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { homeDir } from '@tauri-apps/api/path';
import { RepoTable } from '../components/RepoTable';
import { RepositoryInfo } from '../redux/api/v2/apiResponse';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { repositories, isScanning } = useSelector((state: RootState) => state.repos);
  
  const [commitRepo] = useCommitRepoMutation();
  const [pushRepo] = usePushRepoMutation();
  const [deleteRepo] = useDeleteRepoMutation();

  const {
    filteredData,
    filterDirty, setFilterDirty,
    filterUnpushed, setFilterUnpushed,
    setFilterBranch,
    searchTerm, setSearchTerm
  } = useRepoTable(repositories);

  const handleScan = async () => {
    dispatch(startScan());
    try {
      const home = await homeDir();
      await invoke('scan_repos', { rootPath: home });
    } catch (error) {
      dispatch(setScanError(error as string));
    }
  };

  useEffect(() => {
    const setupListeners = async () => {
      const unlistenStarted = await listen('scan-started', () => {
        dispatch(startScan());
      });
      const unlistenDetected = await listen<RepositoryInfo>('repo-detected', (event) => {
        dispatch(addRepo(event.payload));
      });
      const unlistenFinished = await listen('scan-finished', () => {
        dispatch(finishScan());
      });
      const unlistenError = await listen<string>('scan-error', (event) => {
        console.error(event.payload);
      });

      return () => {
        unlistenStarted();
        unlistenDetected();
        unlistenFinished();
        unlistenError();
      };
    };

    const promise = setupListeners();
    
    // Initial scan
    handleScan();

    return () => {
        promise.then(unlisten => unlisten());
    };
  }, [dispatch]);

  const handleCommit = (path: string) => {
      commitRepo({ path, message: "Auto-commit: GitExodus system backup" });
  };

  const handlePush = (path: string) => {
      pushRepo(path);
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
        <Button onClick={handleScan} disabled={isScanning}>
          <RotateCcw className={cn("mr-2 h-4 w-4", isScanning && "animate-spin")} />
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
            <Select 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBranch(e.target.value || null)}
            >
                <option value="">All Branches</option>
                {Array.from(new Set(repositories.map(r => r.current_branch))).filter(Boolean).map(branch => (
                    <option key={branch as string} value={branch as string}>{branch as string}</option>
                ))}
            </Select>
        </div>
      </div>

      <RepoTable 
        data={filteredData}
        isScanning={isScanning}
        onCommit={handleCommit}
        onPush={handlePush}
        onDelete={handleDelete}
      />
    </div>
  );
};
