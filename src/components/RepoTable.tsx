import { RepositoryInfo } from "../redux/api/v2/apiResponse";
import { 
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell, 
    Badge, Button 
} from "./ui/core";
import { GitCommit, ArrowUpCircle, Trash2, Eye, Undo } from "lucide-react";
import { OpenWithMenu } from "./OpenWithMenu";
import { Popconfirm } from "./ui/Popconfirm";

interface RepoTableProps {
  data: RepositoryInfo[];
  isScanning: boolean;
  onCommit: (path: string) => void;
  onPush: (path: string) => void;
  onDelete: (path: string) => void;
  onViewChanges: (path: string) => void;
  onDiscardAll: (path: string) => void;
  selectedPaths: Set<string>;
  onSelectionChange: (paths: Set<string>) => void;
}

export const RepoTable = ({ 
  data, isScanning, onCommit, onPush, onDelete, onViewChanges, onDiscardAll,
  selectedPaths, onSelectionChange
}: RepoTableProps) => {
  const allSelected = data.length > 0 && data.every(r => selectedPaths.has(r.path));
  const someSelected = data.some(r => selectedPaths.has(r.path));

  const handleToggleAll = () => {
    if (allSelected) {
      const next = new Set(selectedPaths);
      data.forEach(r => next.delete(r.path));
      onSelectionChange(next);
    } else {
      const next = new Set(selectedPaths);
      data.forEach(r => next.add(r.path));
      onSelectionChange(next);
    }
  };

  const handleToggleRow = (path: string) => {
    const next = new Set(selectedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    onSelectionChange(next);
  };

  return (
    <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected; }}
                  onChange={handleToggleAll}
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isScanning && data.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Scanning for repositories...</TableCell></TableRow>
            ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">No repositories found.</TableCell></TableRow>
            ) : data.map((repo) => (
              <TableRow key={repo.path} data-selected={selectedPaths.has(repo.path)} className={selectedPaths.has(repo.path) ? "bg-primary/5" : ""}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedPaths.has(repo.path)}
                    onChange={() => handleToggleRow(repo.path)}
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                </TableCell>
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
                  <div className="flex justify-end gap-1">
                    <OpenWithMenu path={repo.path} />
                    <Popconfirm
                      title="Delete Repository"
                      description="Are you sure? This cannot be undone."
                      onConfirm={() => onDelete(repo.path)}
                      variant="destructive"
                    >
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" title="Delete">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="Discard Changes"
                      description="Discard all changes in this repository? This cannot be undone."
                      onConfirm={() => onDiscardAll(repo.path)}
                      variant="destructive"
                    >
                      <Button size="icon" variant="ghost" disabled={!repo.is_dirty} className="text-muted-foreground hover:text-destructive" title="Discard Changes">
                          <Undo className="h-4 w-4" />
                      </Button>
                    </Popconfirm>
                    <Button size="icon" variant="ghost" onClick={() => onViewChanges(repo.path)} disabled={!repo.is_dirty} className="text-muted-foreground hover:text-primary" title="View Changes">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onPush(repo.path)} disabled={!repo.has_unpushed_commits} className="text-muted-foreground hover:text-primary" title="Push">
                        <ArrowUpCircle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onCommit(repo.path)} disabled={!repo.is_dirty} className="text-muted-foreground hover:text-primary" title="Commit">
                        <GitCommit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
};
