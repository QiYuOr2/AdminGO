import type { FieldConfig, FormConfig } from './types'
import { useMemo } from 'react'
import { z } from 'zod'

function createStringSchema(field: FieldConfig) {
  let schema = z.string()
  if (field.minLength)
    schema = schema.min(field.minLength)
  if (field.maxLength)
    schema = schema.max(field.maxLength)
  if (field.pattern)
    schema = schema.regex(field.pattern)
  return schema
}

function createNumberSchema(field: FieldConfig) {
  let schema = z.number()
  if (field.min !== undefined)
    schema = schema.min(field.min)
  if (field.max !== undefined)
    schema = schema.max(field.max)
  return schema
}

const schemaCreators: Record<string, (field: FieldConfig) => z.ZodTypeAny> = {
  text: createStringSchema,
  textarea: createStringSchema,
  password: createStringSchema,
  email: () => z.email(),
  number: createNumberSchema,
  checkbox: () => z.boolean(),
  date: () => z.date(),
  file: () => z.any(),
}

function createFieldSchema(field: FieldConfig): z.ZodTypeAny {
  if (field.validation) {
    return field.validation
  }

  const creator = schemaCreators[field.type] || (() => z.string())
  const schema = creator(field)

  return field.required ? schema : schema.optional()
}

export function useValidationSchema<T extends z.ZodType>(config: FormConfig<T>): z.ZodType {
  return useMemo(() => {
    if (config.validationSchema)
      return config.validationSchema

    const schemaFields = config.fields.reduce<Record<string, z.ZodTypeAny>>(
      (acc, field) => ({
        ...acc,
        [field.name]: createFieldSchema(field),
      }),
      {},
    )

    return z.object(schemaFields)
  }, [config.fields, config.validationSchema])
}

export function useDefaultValues(fields: FieldConfig[], initialValues?: Record<string, any>) {
  return useMemo(() => {
    const defaults = fields.reduce<Record<string, any>>(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue }),
      {},
    )
    return { ...defaults, ...initialValues }
  }, [fields, initialValues])
}

function checkDependency(dependsOn: string | undefined, values: Record<string, any>): boolean {
  return dependsOn ? !!values[dependsOn] : true
}

function checkCustomCondition(showWhen: ((values: Record<string, any>) => boolean) | undefined, values: Record<string, any>): boolean {
  return showWhen ? showWhen(values) : true
}

export function shouldShowField(fieldConfig: FieldConfig, watchedValues: Record<string, any>): boolean {
  if (fieldConfig.showWhen) {
    return checkCustomCondition(fieldConfig.showWhen, watchedValues)
  }

  return checkDependency(fieldConfig.dependsOn, watchedValues)
}
