import type { ComponentProps } from 'react'
import type { FieldValues } from 'react-hook-form'
import type z from 'zod'
import type { FieldConfig, FormConfig, FormState } from './types'
import { Button } from '@ago/ui'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ago/ui/basic/form.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { fieldRenderMap } from './field-renderers'
import { useFieldSync } from './field-sync'
import { useFormState, useFormSubmission } from './hooks'
import { shouldShowField, useDefaultValues, useValidationSchema } from './validation'

interface SchemaFormProps<T extends z.ZodType> extends ComponentProps<'form'> {
  config: FormConfig<T>
  initialValues?: Record<string, any>
  onFormStateChange?: (state: FormState) => void
}

export function SchemaForm<T extends z.ZodType>(props: SchemaFormProps<T>) {
  const { config, initialValues, onFormStateChange, ...formProps } = props

  const validationSchema = useValidationSchema(config)
  const defaultValues = useDefaultValues(config.fields, initialValues)
  const { formState, updateFormState } = useFormState(onFormStateChange)

  const form = useForm<FieldValues>({
    resolver: zodResolver(validationSchema as z.ZodAny),
    defaultValues,
    mode: 'onChange',
  })

  const { handleSubmit: handleFormSubmit } = useFormSubmission(config, updateFormState, form)

  const watchedValues = useWatch({ control: form.control })

  // 字段同步功能
  useFieldSync(form, config.fields, watchedValues)

  const isFieldVisible = useCallback((fieldConfig: FieldConfig) => {
    return shouldShowField(fieldConfig, watchedValues)
  }, [watchedValues])

  const handleReset = () => {
    form.reset()
    updateFormState({ errors: {}, touched: {} })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} {...formProps}>
        <div className="space-y-6">
          {config.fields
            .filter(isFieldVisible)
            .map(fieldConfig => (
              <FormField
                control={form.control}
                key={fieldConfig.name}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldConfig.label}
                      {fieldConfig.required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {fieldRenderMap[fieldConfig.type](field, { ...fieldConfig, disabled: fieldConfig.disabled || formState.isSubmitting })}
                    </FormControl>
                    {fieldConfig.description && (
                      <FormDescription>{fieldConfig.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="min-w-[100px]"
            >
              {formState.isSubmitting ? '提交中...' : '提交'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={formState.isSubmitting}
            >
              重置
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
