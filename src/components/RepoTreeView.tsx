// import { RepositoryInfo } from "../redux/api/v2/apiResponse";
import { 
    Badge, Button, Card, CardHeader, CardTitle, CardContent
} from "./ui/core";
import { GitCommit, ArrowUpCircle, Trash2, Eye, Folder, ChevronDown, ChevronRight, Undo } from "lucide-react";
import { OpenWithMenu } from "./OpenWithMenu";
import { Popconfirm } from "./ui/Popconfirm";
import { useState } from "react";
import { RepoGroup } from "../lib/repoUtils";
import { cn } from "../lib/utils";

interface RepoTreeViewProps {
  groups: RepoGroup[];
  isScanning: boolean;
  onCommit: (path: string) => void;
  onPush: (path: string) => void;
  onDelete: (path: string) => void;
  onViewChanges: (path: string) => void;
  onDiscardAll: (path: string) => void;
  selectedPaths: Set<string>;
  onSelectionChange: (paths: Set<string>) => void;
}

export const RepoTreeView = ({ 
  groups, isScanning, onCommit, onPush, onDelete, onViewChanges, onDiscardAll,
  selectedPaths, onSelectionChange
}: RepoTreeViewProps) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (folderName: string) => {
    const next = new Set(collapsedGroups);
    if (next.has(folderName)) {
      next.delete(folderName);
    } else {
      next.add(folderName);
    }
    setCollapsedGroups(next);
  };

  const handleExpandAll = () => setCollapsedGroups(new Set());
  const handleCollapseAll = () => setCollapsedGroups(new Set(groups.map(g => g.folderName)));

  const handleToggleRow = (path: string) => {
    const next = new Set(selectedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    onSelectionChange(next);
  };

  const handleToggleGroup = (group: RepoGroup, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const next = new Set(selectedPaths);
    const allInGroup = group.repositories.every(r => selectedPaths.has(r.path));
    
    if (allInGroup) {
      group.repositories.forEach(r => next.delete(r.path));
    } else {
      group.repositories.forEach(r => next.add(r.path));
    }
    onSelectionChange(next);
  };

  if (isScanning && groups.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">Scanning for repositories...</div>;
  }

  if (groups.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No repositories found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={handleExpandAll} className="text-xs h-7">Expand All</Button>
        <Button variant="ghost" size="sm" onClick={handleCollapseAll} className="text-xs h-7">Collapse All</Button>
      </div>

      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.folderName);
        const groupCount = group.repositories.length;
        const dirtyCount = group.repositories.filter(r => r.is_dirty).length;
        const unpushedCount = group.repositories.filter(r => r.has_unpushed_commits).length;
        const allInGroupChecked = group.repositories.length > 0 && group.repositories.every(r => selectedPaths.has(r.path));
        const someInGroupChecked = group.repositories.some(r => selectedPaths.has(r.path));

        return (
          <Card key={group.folderName} className="border-muted/50">
            <CardHeader 
              className="py-3 px-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors flex flex-row items-center justify-between group/header"
              onClick={() => toggleGroup(group.folderName)}
            >
              <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={allInGroupChecked}
                    ref={(el) => { if (el) el.indeterminate = !allInGroupChecked && someInGroupChecked; }}
                    onChange={(e) => handleToggleGroup(group, e)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 cursor-pointer accent-primary shrink-0"
                />
                <div className="flex items-center gap-2">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <Folder className="h-4 w-4 text-primary" />
                    <div>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            {group.folderName}
                            <Badge variant="secondary" className="h-5 text-[10px] font-normal">{groupCount}</Badge>
                        </CardTitle>
                        <div className="text-[10px] text-muted-foreground font-normal truncate max-w-md">
                            {group.basePath}
                        </div>
                    </div>
                </div>
              </div>
              <div className="flex gap-2">
                {dirtyCount > 0 && <Badge variant="destructive" className="h-5 text-[10px]">{dirtyCount} Dirty</Badge>}
                {unpushedCount > 0 && <Badge variant="default" className="bg-amber-600 h-5 text-[10px]">{unpushedCount} Unpushed</Badge>}
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-0 border-t border-muted/50">
                <div className="divide-y divide-muted/30">
                  {group.repositories.map((repo) => (
                      <div 
                        key={repo.path} 
                        className={cn(
                          "flex items-center justify-between p-3 pl-10 hover:bg-accent/5 transition-colors group",
                          selectedPaths.has(repo.path) && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <input
                            type="checkbox"
                            checked={selectedPaths.has(repo.path)}
                            onChange={() => handleToggleRow(repo.path)}
                            className="h-4 w-4 cursor-pointer accent-primary shrink-0"
                          />
                          <div className="overflow-hidden">
                            <div className="font-medium text-sm flex items-center gap-2">
                              {repo.name}
                              <Badge variant="secondary" className="text-[10px] h-4 font-normal px-1.5">{repo.current_branch}</Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate" title={repo.path}>
                              {repo.path}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <div className="flex gap-1">
                              {repo.is_dirty && <Badge variant="destructive" className="h-4 text-[9px] px-1">Dirty</Badge>}
                              {repo.has_unpushed_commits && <Badge variant="default" className="bg-amber-600 h-4 text-[9px] px-1">Unpushed</Badge>}
                              {!repo.is_dirty && !repo.has_unpushed_commits && <Badge variant="outline" className="text-green-500 border-green-500 h-4 text-[9px] px-1">Clean</Badge>}
                          </div>
                          
                          <div className="flex items-center gap-1 border-l pl-3 border-muted-foreground/20">
                            <OpenWithMenu path={repo.path} />
                            <Popconfirm
                              title="Delete Repository"
                              description="Are you sure? This cannot be undone."
                              onConfirm={() => onDelete(repo.path)}
                              variant="destructive"
                            >
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </Popconfirm>
                            <Popconfirm
                              title="Discard Changes"
                              description="Discard all changes in this repository? This cannot be undone."
                              onConfirm={() => onDiscardAll(repo.path)}
                              variant="destructive"
                            >
                              <Button size="icon" variant="ghost" disabled={!repo.is_dirty} className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Discard Changes">
                                  <Undo className="h-3.5 w-3.5" />
                              </Button>
                            </Popconfirm>
                            <Button size="icon" variant="ghost" onClick={() => onViewChanges(repo.path)} disabled={!repo.is_dirty} className="h-8 w-8 text-muted-foreground hover:text-primary" title="View Changes">
                                <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => onPush(repo.path)} disabled={!repo.has_unpushed_commits} className="h-8 w-8 text-muted-foreground hover:text-primary" title="Push">
                                <ArrowUpCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => onCommit(repo.path)} disabled={!repo.is_dirty} className="h-8 w-8 text-muted-foreground hover:text-primary" title="Commit">
                                <GitCommit className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
