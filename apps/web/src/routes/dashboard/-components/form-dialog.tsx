import type { ReactNode } from 'react'
import type z from 'zod'
import type { FormConfig } from '~/components/schema-form/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ago/ui/basic/dialog.tsx'
import { SchemaForm } from '~/components/schema-form'

interface FormDialogProps<T extends z.ZodType> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  config: FormConfig<T>
  initialValues?: Record<string, any>
  children?: ReactNode
}

export function FormDialog<T extends z.ZodType>({
  open,
  onOpenChange,
  title,
  config,
  initialValues,
  children,
}: FormDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <SchemaForm
          config={config}
          initialValues={initialValues}
          className="py-4"
        />
      </DialogContent>
    </Dialog>
  )
}
