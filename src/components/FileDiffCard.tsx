import * as React from "react"
import { useGetFileDiffContentQuery } from "../redux/api/v2/gitApi"
import ReactDiffViewer from 'react-diff-viewer-continued'
import { FileText, Loader2, Copy, Check } from "lucide-react"
import { useTheme } from "./ThemeProvider"

interface FileDiffCardProps {
  repoPath: string
  filePath: string
  status: string
}

export const FileDiffCard = ({ repoPath, filePath, status }: FileDiffCardProps) => {
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = React.useState(false)

  const { 
    data: diffContent, 
    isFetching 
  } = useGetFileDiffContentQuery({ repoPath, filePath })

  const handleCopyPath = () => {
    navigator.clipboard.writeText(filePath)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'deleted': return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    }
  }

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{filePath}</span>
          <button 
              onClick={handleCopyPath}
              className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"
              title="Copy path"
          >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <div className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
            {status}
        </div>
      </div>
      
      <div className="relative text-sm [&>table]:w-full">
        {isFetching ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-3 text-primary/50" />
            <span>Loading diff...</span>
          </div>
        ) : diffContent ? (
          <ReactDiffViewer
              oldValue={diffContent.original_content}
              newValue={diffContent.modified_content}
              splitView={true}
              useDarkTheme={resolvedTheme === 'dark'}
              leftTitle={status === 'added' ? undefined : "HEAD"}
              rightTitle={status === 'deleted' ? undefined : "Working Tree"}
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
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Failed to load diff content.
          </div>
        )}
      </div>
    </div>
  )
}
