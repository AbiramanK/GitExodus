import { useState } from 'react';
import { 
    Badge, Button, Card, CardHeader, CardContent 
} from "./ui/core";
import { 
    Folder, FolderOpen, ChevronRight, ChevronDown, GitBranch, 
    GitCommit, ArrowUpCircle, Trash2, Eye, Undo, History 
} from "lucide-react";
import { GitLogDialog } from "./GitLogDialog";
import { ExplorerNode } from '../lib/repoUtils';
import { cn } from "../lib/utils";
import { OpenWithMenu } from "./OpenWithMenu";
import { Popconfirm } from "./ui/Popconfirm";

interface ExplorerTreeViewProps {
  rootNode: ExplorerNode;
  isScanning: boolean;
  onCommit: (path: string) => void;
  onPush: (path: string) => void;
  onDelete: (path: string) => void;
  onViewChanges: (path: string) => void;
  onDiscardAll: (path: string) => void;
  selectedPaths: Set<string>;
  onSelectionChange: (paths: Set<string>) => void;
}

export const ExplorerTreeView = ({
  rootNode, isScanning, onCommit, onPush, onDelete, onViewChanges, onDiscardAll,
  selectedPaths, onSelectionChange
}: ExplorerTreeViewProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Root']));
  const [logRepo, setLogRepo] = useState<{ path: string; name: string } | null>(null);

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    setExpandedFolders(next);
  };

  const getAllReposUnderNode = (node: ExplorerNode): string[] => {
    const paths: string[] = [];
    if (node.type === 'repo') {
      paths.push(node.path);
    }
    node.children.forEach(child => {
      paths.push(...getAllReposUnderNode(child));
    });
    return paths;
  };

  const getSelectionState = (node: ExplorerNode) => {
    const allRepoPaths = getAllReposUnderNode(node);
    if (allRepoPaths.length === 0) return 'none';
    
    const selectedCount = allRepoPaths.filter(p => selectedPaths.has(p)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === allRepoPaths.length) return 'all';
    return 'some';
  };

  const handleFolderSelection = (node: ExplorerNode, checked: boolean) => {
    const allRepoPaths = getAllReposUnderNode(node);
    const next = new Set(selectedPaths);
    
    if (checked) {
      allRepoPaths.forEach(p => next.add(p));
    } else {
      allRepoPaths.forEach(p => next.delete(p));
    }
    onSelectionChange(next);
  };

  const renderNode = (node: ExplorerNode, depth: number) => {
    const isExpanded = expandedFolders.has(node.path || node.name);
    const isRepo = node.type === 'repo';
    const isSelected = isRepo && selectedPaths.has(node.path);
    const repo = node.repo;

    return (
      <div key={node.path || node.name} className="select-none">
        <div 
          className={cn(
            "group flex items-center py-1.5 px-2 hover:bg-accent/50 cursor-pointer transition-all duration-150 border-l-2 border-transparent",
            isSelected && "bg-primary/5 border-primary/50",
            !isRepo && "font-medium"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => isRepo ? null : toggleFolder(node.path || node.name)}
        >
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            {!isRepo && (
                <div className="w-4 h-4 flex items-center justify-center">
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </div>
            )}
            
            <input
                type="checkbox"
                checked={isRepo ? isSelected : getSelectionState(node) === 'all'}
                ref={(el) => {
                    if (el && !isRepo) {
                        el.indeterminate = getSelectionState(node) === 'some';
                    }
                }}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                    if (isRepo) {
                        const next = new Set(selectedPaths);
                        if (e.target.checked) next.add(node.path);
                        else next.delete(node.path);
                        onSelectionChange(next);
                    } else {
                        handleFolderSelection(node, e.target.checked);
                    }
                }}
                className="h-3.5 w-3.5 cursor-pointer accent-primary rounded shrink-0 mr-1"
            />
            
            {isRepo ? (
               <GitBranch className="h-4 w-4 text-primary shrink-0" />
            ) : (
               isExpanded ? <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" /> : <Folder className="h-4 w-4 text-amber-500 shrink-0" />
            )}

            <span className={cn(
                "text-sm truncate",
                isRepo ? "font-semibold text-foreground/90" : "text-muted-foreground"
            )}>
                {node.name}
            </span>

            {isRepo && repo && (
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="secondary" className="h-4 text-[9px] font-normal px-1">
                    {repo.current_branch}
                </Badge>
                {repo.is_dirty && <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" title="Dirty" />}
                {repo.has_unpushed_commits && <div className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Unpushed" />}
              </div>
            )}
          </div>

          {isRepo && repo && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2 border-l border-muted-foreground/10 ml-2 pl-2">
                 <OpenWithMenu path={repo.path} />
                 <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); onViewChanges(repo.path); }} 
                    disabled={!repo.is_dirty} 
                    className="h-7 w-7 text-muted-foreground hover:text-primary" 
                    title="View Changes"
                 >
                    <Eye className="h-3 w-3" />
                 </Button>
                 <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); onCommit(repo.path); }} 
                    disabled={!repo.is_dirty} 
                    className="h-7 w-7 text-muted-foreground hover:text-primary" 
                    title="Commit"
                >
                    <GitCommit className="h-3 w-3" />
                </Button>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); onPush(repo.path); }} 
                    disabled={!repo.has_unpushed_commits} 
                    className="h-7 w-7 text-muted-foreground hover:text-primary" 
                    title="Push"
                >
                    <ArrowUpCircle className="h-3 w-3" />
                </Button>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); setLogRepo({ path: repo.path, name: repo.name }); }} 
                    className="h-7 w-7 text-muted-foreground hover:text-primary" 
                    title="Commit History"
                >
                    <History className="h-3.5 w-3.5" />
                </Button>
                <Popconfirm
                    title="Discard Changes"
                    description="Discard all changes?"
                    onConfirm={() => onDiscardAll(repo.path)}
                    variant="destructive"
                >
                    <Button size="icon" variant="ghost" disabled={!repo.is_dirty} className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Discard Changes">
                        <Undo className="h-3 w-3" />
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title="Delete"
                    description="Delete repository?"
                    onConfirm={() => onDelete(repo.path)}
                    variant="destructive"
                >
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Delete">
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </Popconfirm>
            </div>
          )}
        </div>

        {!isRepo && isExpanded && node.children.length > 0 && (
          <div className="border-l border-muted-foreground/20 ml-[15px]">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isScanning && (!rootNode.children || rootNode.children.length === 0)) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span>Indexing your repositories...</span>
        </div>
    );
  }

  if (!rootNode.children || rootNode.children.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No repositories found in your system.</div>;
  }

  return (
    <Card className="border-muted/50 overflow-hidden shadow-premium bg-card/50 backdrop-blur-md">
      <CardHeader className="py-2 px-4 bg-muted/20 border-b border-muted/30">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">File Explorer</span>
            <div className="flex gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] px-2"
                    onClick={() => {
                        const allFolders = new Set<string>();
                        const collect = (n: ExplorerNode) => {
                            if (n.type === 'folder') {
                                allFolders.add(n.path || n.name);
                                n.children.forEach(collect);
                            }
                        };
                        collect(rootNode);
                        setExpandedFolders(allFolders);
                    }}
                >
                    Expand All
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] px-2"
                    onClick={() => setExpandedFolders(new Set(['Root']))}
                >
                    Collapse All
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {rootNode.children.map(child => renderNode(child, 0))}
      </CardContent>

      {logRepo && (
          <GitLogDialog 
              repoPath={logRepo.path} 
              repoName={logRepo.name} 
              onClose={() => setLogRepo(null)} 
          />
      )}
    </Card>
  );
};
