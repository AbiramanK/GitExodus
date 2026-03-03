import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/Dialog"
import { 
  FileText, Plus, Trash2, Edit2, Loader2, Copy, Check, FileCode2, GitCompare,
  ArrowLeft
} from "lucide-react"
import ReactDiffViewer from 'react-diff-viewer-continued'
import { cn } from "../lib/utils"
import { useTheme } from "./ThemeProvider"
import { Popconfirm } from "./ui/Popconfirm"
import { Button } from "./ui/core"
import { useGetRepoChangesQuery, useGetFileDiffContentQuery, useDiscardFileChangesMutation, useDiscardHunkMutation } from "../redux/api/v2/gitApi"
import { Undo } from "lucide-react"

interface DiffViewerDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  repoPath: string
  repoName: string
}

export const DiffViewerDialog = ({ isOpen, onOpenChange, repoPath, repoName }: DiffViewerDialogProps) => {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null)
  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = React.useState(320)
  const [isResizing, setIsResizing] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const { resolvedTheme } = useTheme()

  const [discardFile, { isLoading: isDiscarding }] = useDiscardFileChangesMutation()
  const [discardHunk, { isLoading: isHunkDiscarding }] = useDiscardHunkMutation()

  const handleDiscard = async (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation();
    try {
      await discardFile({ repoPath, filePath }).unwrap();
      if (selectedFile === filePath) {
          const nextFile = changes?.find(c => c.path !== filePath)?.path || null;
          setSelectedFile(nextFile);
      }
    } catch (err) {
      console.error("Failed to discard changes:", err);
    }
  };

  const handleDiscardHunk = async (patch: string) => {
    try {
      await discardHunk({ repoPath, patch }).unwrap();
    } catch (err) {
      console.error("Failed to discard hunk:", err);
    }
  };

  const { 
    data: changes, 
    isLoading: isChangesLoading,
    error: changesError
  } = useGetRepoChangesQuery(repoPath, { skip: !isOpen || !repoPath })

  // Fetch diff content for the selected file
  const { 
    data: diffContent, 
    isFetching: isDiffFetching 
  } = useGetFileDiffContentQuery(
    { repoPath, filePath: selectedFile || '' }, 
    { skip: !isOpen || !selectedFile }
  )

  // Reset state when dialog closes or repo changes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
    }
  }, [isOpen, repoPath])

  // Auto-select first file if available
  React.useEffect(() => {
    if (changes && changes.length > 0 && !selectedFile) {
      setSelectedFile(changes[0].path)
    }
  }, [changes, selectedFile])

  // Mouse event listeners for resizing
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // Add minimum and maximum bounds to the sidebar width
      const newWidth = Math.max(200, Math.min(e.clientX, window.innerWidth - 300));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // Re-enable text selection
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Disable text selection while dragging
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection on quick click
    setIsResizing(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added': return <Plus className="h-4 w-4 text-emerald-500" />
      case 'deleted': return <Trash2 className="h-4 w-4 text-rose-500" />
      default: return <Edit2 className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'added': return <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Added</span>
      case 'deleted': return <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">Deleted</span>
      default: return <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">Modified</span>
    }
  }

  const getFileNameAndDir = (path: string) => {
    const parts = path.split('/');
    const name = parts.pop() || path;
    const dir = parts.length > 0 ? parts.join('/') + '/' : '';
    return { name, dir };
  };

  const parseHunk = (patch: string) => {
    const lines = patch.split('\n');
    const oldLines: string[] = [];
    const newLines: string[] = [];
    
    let started = false;
    for (const line of lines) {
      if (line.startsWith('@@')) {
        started = true;
        continue;
      }
      if (!started) continue;
      
      if (line.startsWith(' ')) {
        oldLines.push(line.slice(1));
        newLines.push(line.slice(1));
      } else if (line.startsWith('-')) {
        oldLines.push(line.slice(1));
      } else if (line.startsWith('+')) {
        newLines.push(line.slice(1));
      }
    }
    
    return {
      oldValue: oldLines.join('\n'),
      newValue: newLines.join('\n')
    };
  };

  const handleCopyPath = () => {
    if (selectedFile) {
        navigator.clipboard.writeText(selectedFile);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen sm:rounded-none border-none flex flex-col p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-muted/30 backdrop-blur-sm flex flex-row items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="hover:bg-muted rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <DialogTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-primary" />
                Repository Changes
            </DialogTitle>
            <DialogDescription className="mt-1">
              Viewing working tree differences for <span className="font-semibold text-foreground/90">{repoName}</span>
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* File List Sidebar */}
          <div 
            className="border-r bg-muted/10 flex flex-col overflow-y-auto shrink-0 relative"
            style={{ width: sidebarWidth }}
          >
            {isChangesLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary/50" />
                <p className="text-sm font-medium">Loading changes...</p>
              </div>
            ) : changesError ? (
              <div className="flex items-center justify-center h-full p-4">
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md border border-destructive/20 text-center">
                    Failed to load repository changes.
                </div>
              </div>
            ) : changes?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                <Check className="h-10 w-10 mb-4 text-emerald-500/50" />
                <p className="font-medium text-foreground">Working tree clean</p>
                <p className="text-sm mt-1">No changes detected in working directory.</p>
              </div>
            ) : (
              <div className="py-3">
                <div className="px-4 pb-2 mb-2 flex items-center justify-between border-b border-border/50">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Changed Files
                  </span>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {changes?.length}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 px-2">
                  {changes?.map((change) => {
                    const { name, dir } = getFileNameAndDir(change.path);
                    const isSelected = selectedFile === change.path;
                    return (
                      <React.Fragment key={change.path}>
                        <div
                        className={cn(
                          "w-full flex items-center gap-2 group relative pr-2",
                          isSelected 
                            ? "bg-primary/10 text-primary rounded-md" 
                            : "hover:bg-muted/50 text-foreground/80 hover:text-foreground rounded-md"
                        )}
                      >
                        <button
                          onClick={() => setSelectedFile(change.path)}
                          className="flex-1 flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 min-w-0"
                        >
                          <div className={cn("p-1.5 rounded-md shrink-0", isSelected ? "bg-background shadow-sm" : "bg-muted/50 group-hover:bg-background group-hover:shadow-sm")}>
                            {getStatusIcon(change.status)}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                            <span className="text-sm font-medium truncate" title={name}>
                              {name}
                            </span>
                            {dir && (
                              <span className="text-[10px] truncate opacity-60" title={dir}>
                                {dir}
                              </span>
                            )}
                          </div>
                          {isSelected && !isDiscarding && (
                             <div className="shrink-0">
                               {getStatusBadge(change.status)}
                             </div>
                          )}
                        </button>
                        
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Popconfirm
                             title="Discard Changes"
                             description={`Discard all changes in ${name}? This cannot be undone.`}
                             onConfirm={() => { handleDiscard(null as any, change.path); }}
                           >
                             <button
                               disabled={isDiscarding}
                               className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                               onClick={(e) => e.stopPropagation()}
                               title="Discard changes"
                             >
                               {isDiscarding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                             </button>
                           </Popconfirm>
                        </div>

                        {isSelected && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-md" />
                        )}
                      </div>

                    </React.Fragment>
                  )
                })}
              </div>
              </div>
            )}
          </div>

          {/* Resizer Handle */}
          <div
            className={cn(
              "w-2 cursor-col-resize hover:bg-primary/20 absolute top-0 bottom-0 z-10 transition-colors shrink-0 flex items-center justify-center group",
              isResizing ? "bg-primary/20" : "bg-transparent"
            )}
            style={{ left: sidebarWidth - 4 }}
            onMouseDown={handleMouseDown}
          >
            <div className={cn(
              "w-1 h-12 rounded-full transition-colors",
              isResizing ? "bg-primary" : "bg-border group-hover:bg-primary/50"
            )} />
          </div>

          {/* Diff Viewer Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {!selectedFile ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-5 bg-muted/5">
                <div className="p-6 rounded-full bg-muted/30 border border-muted ring-4 ring-muted/10">
                    <FileCode2 className="h-10 w-10 text-muted-foreground/60" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-foreground/80">Select a file to review</p>
                    <p className="text-sm mt-1 max-w-sm">Choose a modified, added, or deleted file from the left sidebar to view its changes side-by-side.</p>
                </div>
              </div>
            ) : isDiffFetching ? (
               <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50 mb-4" />
                <p className="text-sm">Fetching diff content...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden w-full relative group">
                 {/* Premium Diff Header */}
                 <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                     <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-4 py-2 border rounded-full shadow-sm pointer-events-auto transition-opacity duration-300 opacity-90 hover:opacity-100">
                         <FileText className="h-4 w-4 text-muted-foreground" />
                         <span className="font-mono text-[13px] tracking-tight">{selectedFile}</span>
                         <button 
                             onClick={handleCopyPath}
                             className="ml-2 p-1.5 hover:bg-muted rounded-full transition-colors focus:outline-none"
                             title="Copy path"
                         >
                             {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                         </button>
                     </div>
                     
                     <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 border rounded-full shadow-sm pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                             {changes?.find(c => c.path === selectedFile)?.status || 'Modified'}
                         </span>
                     </div>
                 </div>
                 
                 {/* Segmented Diff Content */}
                 <div className="flex-1 overflow-auto pt-16 px-4 pb-4 space-y-8">
                     {diffContent?.hunks && diffContent.hunks.length > 0 ? (
                       diffContent.hunks.map((hunk, idx) => {
                         const { oldValue, newValue } = parseHunk(hunk.patch);
                         return (
                           <div key={idx} className="flex flex-col">
                             <div className="flex items-center justify-between bg-muted/20 px-3 py-2 border-x border-t rounded-t-md">
                               <span className="font-mono text-[11px] text-muted-foreground">
                                 {hunk.header}
                               </span>
                               <Popconfirm
                                 title="Discard Segment"
                                 description="Undo only this segment of changes? This cannot be reversed."
                                 onConfirm={() => handleDiscardHunk(hunk.patch)}
                               >
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   className="h-7 px-2 text-[11px] gap-1.5 hover:bg-destructive/10 hover:text-destructive"
                                   disabled={isHunkDiscarding}
                                 >
                                   {isHunkDiscarding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo className="h-3 w-3" />}
                                   Discard Segment
                                 </Button>
                               </Popconfirm>
                             </div>
                             <div className="rounded-b-md border bg-card shadow-sm overflow-hidden text-sm [&>table]:w-full relative">
                                <ReactDiffViewer
                                    oldValue={oldValue}
                                    newValue={newValue}
                                    splitView={true}
                                    useDarkTheme={resolvedTheme === 'dark'}
                                    styles={{
                                        variables: {
                                            dark: {
                                                diffViewerBackground: 'transparent',
                                                diffViewerColor: 'hsl(var(--foreground))',
                                                addedBackground: 'rgba(34, 197, 94, 0.05)',
                                                addedColor: 'hsl(var(--foreground))',
                                                removedBackground: 'rgba(239, 68, 68, 0.05)',
                                                removedColor: 'hsl(var(--foreground))',
                                                wordAddedBackground: 'rgba(34, 197, 94, 0.25)',
                                                wordRemovedBackground: 'rgba(239, 68, 68, 0.25)',
                                                addedGutterBackground: 'rgba(34, 197, 94, 0.1)',
                                                removedGutterBackground: 'rgba(239, 68, 68, 0.1)',
                                                gutterBackground: 'hsl(var(--muted)/0.3)',
                                                gutterBackgroundDark: 'hsl(var(--muted)/0.3)',
                                                highlightBackground: 'hsl(var(--accent))',
                                                highlightGutterBackground: 'hsl(var(--accent))',
                                                codeFoldGutterBackground: 'hsl(var(--muted)/0.5)',
                                                codeFoldBackground: 'hsl(var(--muted)/0.2)',
                                                emptyLineBackground: 'transparent',
                                                gutterColor: 'hsl(var(--muted-foreground))',
                                                addedGutterColor: 'rgba(34, 197, 94, 0.8)',
                                                removedGutterColor: 'rgba(239, 68, 68, 0.8)',
                                            }
                                        }
                                    }}
                                />
                             </div>
                           </div>
                         );
                       })
                     ) : (
                        <div className="rounded-md border bg-card shadow-sm overflow-hidden text-sm [&>table]:w-full relative">
                            <ReactDiffViewer
                                oldValue={diffContent?.original_content || ''}
                                newValue={diffContent?.modified_content || ''}
                                splitView={true}
                                useDarkTheme={resolvedTheme === 'dark'}
                                leftTitle="HEAD (Original)"
                                rightTitle="Working Tree (Modified)"
                                styles={{
                                    variables: {
                                        dark: {
                                            diffViewerBackground: 'transparent',
                                            diffViewerColor: 'hsl(var(--foreground))',
                                            addedBackground: 'rgba(34, 197, 94, 0.05)',
                                            addedColor: 'hsl(var(--foreground))',
                                            removedBackground: 'rgba(239, 68, 68, 0.05)',
                                            removedColor: 'hsl(var(--foreground))',
                                            wordAddedBackground: 'rgba(34, 197, 94, 0.25)',
                                            wordRemovedBackground: 'rgba(239, 68, 68, 0.25)',
                                            addedGutterBackground: 'rgba(34, 197, 94, 0.1)',
                                            removedGutterBackground: 'rgba(239, 68, 68, 0.1)',
                                            gutterBackground: 'hsl(var(--muted)/0.3)',
                                            gutterBackgroundDark: 'hsl(var(--muted)/0.3)',
                                            highlightBackground: 'hsl(var(--accent))',
                                            highlightGutterBackground: 'hsl(var(--accent))',
                                            codeFoldGutterBackground: 'hsl(var(--muted)/0.5)',
                                            codeFoldBackground: 'hsl(var(--muted)/0.2)',
                                            emptyLineBackground: 'transparent',
                                            gutterColor: 'hsl(var(--muted-foreground))',
                                            addedGutterColor: 'rgba(34, 197, 94, 0.8)',
                                            removedGutterColor: 'rgba(239, 68, 68, 0.8)',
                                        }
                                    }
                                }}
                            />
                        </div>
                     )}
                 </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
