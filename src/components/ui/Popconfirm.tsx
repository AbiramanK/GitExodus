import * as React from "react"
import { createPortal } from "react-dom"
import { AlertCircle } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./core"

interface PopconfirmProps {
  title: string
  description?: string
  onConfirm: () => void
  onCancel?: () => void
  children: React.ReactElement
  okText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export const Popconfirm = ({ 
  title, 
  description, 
  onConfirm, 
  onCancel, 
  children, 
  okText = "Confirm", 
  cancelText = "Cancel",
  variant = "destructive"
}: PopconfirmProps) => {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setCoords({
        top: rect.top + window.scrollY - 10, // Above the trigger
        left: rect.left + window.scrollX + rect.width / 2
      })
      setOpen(true)
    }
  }

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    onConfirm()
    setOpen(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel?.()
    setOpen(false)
  }

  return (
    <>
      <div ref={triggerRef} onClick={handleOpen} className="inline-block">
        {children}
      </div>

      {open && createPortal(
        <div className="fixed inset-0 z-[100] h-screen w-screen" onClick={handleCancel}>
          <div 
            className="absolute z-[101] w-64 -translate-x-1/2 -translate-y-full rounded-lg border bg-popover p-4 shadow-xl animate-in fade-in zoom-in-95"
            style={{ 
              top: `${coords.top}px`, 
              left: `${coords.left}px` 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className={cn("mt-0.5 h-4 w-4", variant === 'destructive' ? "text-destructive" : "text-primary")} />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{title}</p>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={handleCancel}>
                {cancelText}
              </Button>
              <Button 
                size="sm" 
                variant={variant === 'destructive' ? 'destructive' : 'default'} 
                className="h-8 px-2 text-xs" 
                onClick={handleConfirm}
              >
                {okText}
              </Button>
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-border" />
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-7 border-transparent border-t-popover" />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
