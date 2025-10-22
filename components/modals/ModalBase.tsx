import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ModalBaseProps {
  title: string
  description?: string
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ModalBase({ title, description, children, open, onOpenChange }: ModalBaseProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md py-10 px-6 sm:px-8 lg:px-10">
        <DialogHeader className="mb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}