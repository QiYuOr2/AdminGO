import type { ComponentProps } from 'react'
import type { FormConfig } from './types'
import { Form, FormField, FormItem } from '@ago/ui/basic/form.tsx'
import { useForm } from 'react-hook-form'

interface SchemaFormProps extends ComponentProps<'form'> {
  config: FormConfig
}

export function SchemaForm(props: SchemaFormProps) {
  const { fields } = props.config

  const form = useForm({})

  return (
    <Form {...form}>
      {fields.map(config => (
        <FormField
          control={form.control}
          key={config.name}
          name={config.name}
          defaultValue={config.defaultValue}
          render={({ field }) => (
            <FormItem>{field.name}</FormItem>
          )}
        />
      ))}
    </Form>
  )
}
