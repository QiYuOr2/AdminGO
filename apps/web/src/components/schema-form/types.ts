export type FieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox'

export interface FieldConfig<ValueType = any> {
  name: string
  label: string
  type: FieldType
  defaultValue?: ValueType
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  options?: Array<{ label: string, value: ValueType }>
  placeholder?: string
}

export interface FormConfig {
  fields: FieldConfig[]
  endpoint: string
  method?: 'POST' | 'PUT' | 'PATCH'
  headers?: Record<string, string>
}
