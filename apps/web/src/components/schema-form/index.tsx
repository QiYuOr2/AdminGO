import type { ComponentProps, JSX } from 'react'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import type { FieldConfig, FieldType, FormConfig } from './types'
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ago/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ago/ui/basic/form.tsx'
import { useForm } from 'react-hook-form'

interface SchemaFormProps extends ComponentProps<'form'> {
  config: FormConfig
}

type FieldRender = (field: ControllerRenderProps<FieldValues, string>, config?: FieldConfig) => JSX.Element
type InputRender = (type: FieldType) => FieldRender
type FieldRenderMap = Record<FieldType, FieldRender>

export function SchemaForm(props: SchemaFormProps) {
  const { fields } = props.config

  const form = useForm({})

  const InputField: InputRender = (type) => {
    return field => (
      <>
        <Input {...field} type={type} />
      </>
    )
  }

  const SelectField: FieldRender = (field, config) => {
    if (!config?.options) {
      return (
        <div className="text-red-500">
          <span>配置缺失：</span>
          <pre><code>config.options</code></pre>
        </div>
      )
    }

    return (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger>
          <SelectValue placeholder={config?.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {config.options.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const fieldRenderMap: FieldRenderMap = {
    text: InputField('text'),
    checkbox: InputField('checkbox'),
    number: InputField('number'),
    email: InputField('email'),
    select: SelectField,
  }

  const onSubmit = () => {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map(config => (
          <FormField
            control={form.control}
            key={config.name}
            name={config.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{config.label}</FormLabel>
                <FormControl>
                  {fieldRenderMap[config.type](field, config)}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  )
}
