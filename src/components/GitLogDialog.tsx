import { GitCommitInfo, BranchInfo } from "../redux/api/v2/apiResponse";
import { useGetRepoLogQuery, useGetRepoBranchesQuery } from "../redux/api/v2/gitApi";
import { 
    Button, Badge, CardHeader, CardTitle, CardContent, Input
} from "./ui/core";
import { X, History, User, Loader2, GitBranch, Github, Search, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../lib/utils";
import { useEffect, useState, useMemo } from "react";

interface GitLogDialogProps {
  repoPath: string;
  repoName: string;
  onClose: () => void;
}

type Tab = "history" | "branches";

export const GitLogDialog = ({ repoPath, repoName, onClose }: GitLogDialogProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const [branchSearch, setBranchSearch] = useState("");
  
  const { data: logs, isLoading: loadingLogs, error: logsError } = useGetRepoLogQuery(repoPath);
  const { data: branches, isLoading: loadingBranches } = useGetRepoBranchesQuery(repoPath);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 300); // Wait for transition
  };

  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    return branches.filter((b: BranchInfo) => b.name.toLowerCase().includes(branchSearch.toLowerCase()))
      .sort((a: BranchInfo, b: BranchInfo) => {
        if (a.is_head) return -1;
        if (b.is_head) return 1;
        if (a.is_remote !== b.is_remote) return a.is_remote ? 1 : -1;
        return a.name.localeCompare(b.name);
      });
  }, [branches, branchSearch]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto",
          mounted ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "relative w-full max-w-md h-full bg-card border-l border-muted/30 shadow-2xl transition-transform duration-300 ease-in-out pointer-events-auto flex flex-col",
          mounted ? "translate-x-0" : "translate-x-full"
        )}
      >
        <CardHeader className="py-5 px-6 border-b border-muted/30 bg-muted/20 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <CardTitle className="text-lg font-bold leading-tight truncate">Repository</CardTitle>
                <p className="text-[10px] text-muted-foreground font-mono truncate max-w-70" title={repoPath}>
                  {repoName}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full hover:bg-muted/50">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex p-1 bg-muted/30 rounded-lg gap-1">
            <button 
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all",
                activeTab === "history" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="h-3.5 w-3.5" />
              History
            </button>
            <button 
              onClick={() => setActiveTab("branches")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all",
                activeTab === "branches" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GitBranch className="h-3.5 w-3.5" />
              Branches
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
          {activeTab === "history" ? (
            // HISTORY TAB
            loadingLogs ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <div className="relative">
                  <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                  <History className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm font-medium animate-pulse">Retrieving history...</p>
              </div>
            ) : logsError ? (
              <div className="p-10 text-center flex flex-col items-center gap-4">
                <X className="h-8 w-8 text-destructive" />
                <p className="font-bold text-lg mb-1">Retrieval Failed</p>
                <p className="text-xs text-muted-foreground">{logsError.toString()}</p>
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="divide-y divide-muted/20 pb-10">
                {logs.map((commit: GitCommitInfo, idx: number) => (
                  <div key={commit.id} className={cn("p-5 px-6 hover:bg-muted/5 transition-all group border-l-2 border-transparent", idx === 0 && "bg-primary/5 border-l-primary")}>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-semibold text-foreground leading-snug tracking-tight">{commit.message}</p>
                        <div className="flex flex-col items-end shrink-0 gap-1.5">
                          <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 h-4 border-muted-foreground/20">{commit.id.substring(0, 7)}</Badge>
                          <span className="text-[10px] text-muted-foreground/60">{formatDistanceToNow(new Date(commit.time * 1000), { addSuffix: true })}</span>
                        </div>
                      </div>
                      {commit.branches && commit.branches.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {commit.branches.map(branch => {
                            const isRemote = branch.includes('/');
                            return (
                              <Badge key={branch} variant="secondary" className={cn("text-[9px] px-1.5 py-0 h-4.5 flex items-center gap-1", isRemote ? "text-amber-600 bg-amber-500/20" : "text-green-600 bg-green-500/20")}>
                                <GitBranch className="h-2.5 w-2.5" />
                                {branch}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">{commit.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-50 italic">
                <Github className="h-12 w-12 mb-4" />
                <p>No history found.</p>
              </div>
            )
          ) : (
            // BRANCHES TAB
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-muted/20 bg-muted/5">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                      placeholder="Search branches..." 
                      className="pl-9 h-9 text-xs" 
                      value={branchSearch}
                      onChange={(e) => setBranchSearch(e.target.value)}
                    />
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-muted/10 pb-10">
                {loadingBranches ? (
                  <div className="flex flex-col items-center justify-center p-20 gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-xs font-medium">Fetching branches...</p>
                  </div>
                ) : filteredBranches.length > 0 ? (
                  filteredBranches.map((branch: BranchInfo) => (
                    <div key={branch.name} className={cn("p-4 px-6 hover:bg-muted/5 transition-all group", branch.is_head && "bg-primary/5")}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {branch.is_head && <Badge variant="default" className="text-[8px] h-3.5 px-1 uppercase font-black">Current</Badge>}
                            <span className={cn("text-sm font-bold truncate", branch.is_head ? "text-primary" : "text-foreground")}>
                              {branch.name}
                            </span>
                          </div>
                          
                          {branch.upstream && (
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <ExternalLink className="h-2.5 w-2.5" />
                              <span className="truncate">Tracking {branch.upstream}</span>
                            </div>
                          )}
                        </div>

                        {!branch.is_remote && branch.upstream && (
                          <div className="flex items-center gap-2">
                            {branch.ahead > 0 && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                <ArrowUp className="h-2.5 w-2.5" />
                                {branch.ahead}
                              </div>
                            )}
                            {branch.behind > 0 && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                <ArrowDown className="h-2.5 w-2.5" />
                                {branch.behind}
                              </div>
                            )}
                            {branch.ahead === 0 && branch.behind === 0 && (
                              <span className="text-[10px] text-muted-foreground/40 font-medium italic">Synced</span>
                            )}
                          </div>
                        )}
                        
                        {branch.is_remote && (
                          <Badge variant="outline" className="text-[9px] text-amber-600 border-amber-500/20 h-4 bg-amber-500/5">Remote</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground opacity-50 italic">
                    <p className="text-sm">No branches found matching "{branchSearch}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <div className="p-6 bg-muted/5 border-t border-muted/20 shrink-0">
          <Button variant="ghost" className="w-full justify-center text-xs font-medium h-9 hover:bg-muted/50" onClick={handleClose}>
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );
};
