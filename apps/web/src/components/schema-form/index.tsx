import type { ComponentProps } from 'react'

interface SchemaFormProps extends ComponentProps<'form'> {
}

export function SchemaForm(props: SchemaFormProps) {
  return (
    <form {...props}></form>
  )
}
