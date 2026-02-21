import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/Dialog"
import { Button } from "./ui/core"
import { LogOut, AlertCircle } from "lucide-react"

interface ExitConfirmDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const ExitConfirmDialog = ({ isOpen, onOpenChange, onConfirm }: ExitConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Exit GitExodus?</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Are you sure you want to close the application? Any unsaved changes across your repositories might not be tracked until the next scan.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6 gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm}
            className="flex-1 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Exit Application
          </Button>
        </DialogFooter>
        
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
