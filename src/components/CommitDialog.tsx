import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/Dialog"
import { Button, Input } from "./ui/core"

interface CommitDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (message: string) => void
  repoName: string
}

export const CommitDialog = ({ isOpen, onOpenChange, onConfirm, repoName }: CommitDialogProps) => {
  const [message, setMessage] = React.useState("Auto-commit: GitExodus system backup")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onConfirm(message.trim())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commit Changes</DialogTitle>
          <DialogDescription>
            Enter a commit message for <span className="font-mono text-primary">{repoName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <Input
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Commit message..."
            className="w-full"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!message.trim()}>
              Commit
            </Button>
          </DialogFooter>
        </form>
        
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
