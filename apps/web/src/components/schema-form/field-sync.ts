import type { UseFormReturn } from 'react-hook-form'
import type { FieldConfig } from './types'
import { useEffect } from 'react'

export function useFieldSync(
  form: UseFormReturn,
  fields: FieldConfig[],
  watchedValues: Record<string, any>,
) {
  useEffect(() => {
    // 处理所有配置了 syncWith 的字段
    fields.forEach((field) => {
      if (!field.syncWith || field.syncWith.length === 0)
        return

      field.syncWith.forEach((rule) => {
        const sourceValue = watchedValues[rule.sourceField]

        // 检查条件是否满足（如果有条件的话）
        if (rule.condition && !rule.condition(sourceValue, watchedValues)) {
          return
        }

        let newValue: any

        switch (rule.type) {
          case 'copy':
            newValue = sourceValue
            break

          case 'transform':
            if (rule.transform) {
              newValue = rule.transform(sourceValue, watchedValues)
            }
            break

          case 'generate':
            if (rule.transform) {
              newValue = rule.transform(sourceValue, watchedValues)
            }
            break

          default:
            return
        }

        // 只有当新值与当前值不同时才更新
        const currentValue = form.getValues(field.name)
        if (newValue !== undefined && newValue !== currentValue) {
          form.setValue(field.name, newValue, {
            shouldValidate: true,
            shouldDirty: false, // 不标记为dirty，因为这是自动生成的
          })
        }
      })
    })
  }, [form, fields, watchedValues])
}

// 一些常用的同步函数
export const syncFunctions = {
  // 从路径生成权限码
  pathToPermissionCode: (path: string) => {
    if (!path)
      return ''
    // 移除开头的 / 并替换其他 / 为 :
    return `${path.replace(/^\//, '').replace(/\//g, ':')}`
  },

  // 从标题生成路径
  titleToPath: (title: string) => {
    if (!title)
      return ''
    // 简单的拼音转换或英文化处理
    return `/${title.toLowerCase().replace(/\s+/g, '-')}`
  },

  // 从路径提取最后一部分作为名称
  pathToName: (path: string) => {
    if (!path)
      return ''
    const parts = path.split('/')
    return parts[parts.length - 1] || ''
  },

  // 条件检查函数
  conditions: {
    // 当源字段不为空时
    notEmpty: (value: any) => value !== null && value !== undefined && value !== '',

    // 当源字段为特定值时
    equals: (targetValue: any) => (value: any) => value === targetValue,

    // 当目标字段为空时（避免覆盖用户输入）
    targetEmpty: (_: any, allValues: Record<string, any>, targetField: string) => {
      const targetValue = allValues[targetField]
      return targetValue === null || targetValue === undefined || targetValue === ''
    },
  },
}
