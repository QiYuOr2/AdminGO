import type { JSX } from 'react'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import type { FieldConfig, FieldType } from './types'
import {
  Input,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@ago/ui'

export type FieldRender = (field: ControllerRenderProps<FieldValues, string>, config: FieldConfig) => JSX.Element
export type FieldRenderMap = Record<FieldType, FieldRender>

export const TextInput: FieldRender = (field, config) => (
  <Input
    {...field}
    type={config.type === 'password' ? 'password' : 'text'}
    placeholder={config.placeholder}
    disabled={config.disabled}
  />
)

export const NumberInput: FieldRender = (field, config) => (
  <Input
    {...field}
    type="number"
    placeholder={config.placeholder}
    min={config.min}
    max={config.max}
    disabled={config.disabled}
    onChange={e => field.onChange(Number(e.target.value))}
  />
)

export const TextareaInput: FieldRender = (field, config) => (
  <Textarea
    {...field}
    placeholder={config.placeholder}
    rows={config.rows || 3}
    disabled={config.disabled}
  />
)

export const SelectInput: FieldRender = (field, config) => {
  if (!config.options) {
    return (
      <div className="text-red-500">
        <span>配置缺失：</span>
        <code>config.options</code>
      </div>
    )
  }

  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      disabled={config.disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {config.options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const RadioInput: FieldRender = (field, config) => {
  if (!config.options) {
    return (
      <div className="text-red-500">
        <span>配置缺失：</span>
        <code>config.options</code>
      </div>
    )
  }

  return (
    <RadioGroup
      options={config.options}
      value={field.value}
      onValueChange={field.onChange}
      disabled={config.disabled}
    />
  )
}

export const CheckboxInput: FieldRender = (field, config) => (
  <Switch
    checked={field.value}
    onCheckedChange={field.onChange}
    disabled={config.disabled}
  />
)

export const DateInput: FieldRender = (field, config) => (
  <Input
    {...field}
    type="date"
    disabled={config.disabled}
    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
    onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
  />
)

export const FileInput: FieldRender = (field, config) => (
  <Input
    type="file"
    accept={config.accept}
    multiple={config.multiple}
    disabled={config.disabled}
    onChange={e => field.onChange(config.multiple ? e.target.files : e.target.files?.[0])}
  />
)

export const fieldRenderMap: FieldRenderMap = {
  text: TextInput,
  password: TextInput,
  email: TextInput,
  number: NumberInput,
  textarea: TextareaInput,
  select: SelectInput,
  radio: RadioInput,
  checkbox: CheckboxInput,
  date: DateInput,
  file: FileInput,
}
