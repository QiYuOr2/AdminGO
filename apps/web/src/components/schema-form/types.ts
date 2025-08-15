import type { z } from 'zod'

export type FieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea' | 'radio' | 'date' | 'file' | 'password'

export interface FieldOption<T = any> {
  label: string
  value: T
  disabled?: boolean
}

export interface FieldSyncRule {
  type: 'transform' | 'copy' | 'generate'
  sourceField: string
  transform?: (sourceValue: any, allValues: Record<string, any>) => any
  condition?: (sourceValue: any, allValues: Record<string, any>) => boolean
}

export interface FieldConfig<ValueType = any> {
  name: string
  label: string
  type: FieldType
  defaultValue?: ValueType
  required?: boolean
  disabled?: boolean
  placeholder?: string
  description?: string

  // Validation rules
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  validation?: z.ZodTypeAny

  // Field-specific options
  options?: Array<FieldOption<ValueType>>
  multiple?: boolean
  accept?: string // for file inputs
  rows?: number // for textarea

  // Conditional rendering
  dependsOn?: string
  showWhen?: (formValues: Record<string, any>) => boolean

  // Field synchronization
  syncWith?: FieldSyncRule[]
}

export interface FormConfig<V extends z.ZodType> {
  fields: FieldConfig[]
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  onSubmit?: (data: Record<string, any>) => void | Promise<void>
  onError?: (error: any) => void
  resetOnSubmit?: boolean
  validationSchema?: V
}

export interface FormState {
  isLoading: boolean
  isSubmitting: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}
