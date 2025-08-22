import type { ComponentProps } from 'react'
import type { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form'
import { Form } from 'antd'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'

interface HookFormProps<T extends FieldValues> extends ComponentProps<typeof Form> {
  rhf: UseFormReturn<T>
  onOk?: (data: T) => void
  onFailed?: (errors: FieldErrors<T>) => void
}

function HookForm<T extends FieldValues>({ rhf, children, onOk, onFailed, ...rest }: HookFormProps<T>) {
  const _onFinish = () => {
    rhf.handleSubmit(
      (data, _event) => onOk?.(data),
      onFailed,
    )()
  }

  return (
    <Form onFinish={_onFinish} {...rest}>
      <FormProvider {...rhf}>{children}</FormProvider>
    </Form>
  )
}

interface HookFormItemProps extends ComponentProps<typeof Form.Item> {}
interface HookFormItemControllerProps extends ComponentProps<typeof Controller> {}

function HookFormItem({ children, ...rest }: HookFormItemProps & HookFormItemControllerProps) {
  const { control } = useFormContext()

  return (
    <Form.Item label={rest.label}>
      <Controller
        name={rest.name}
        control={control}
        rules={rest.rules}
        render={rest.render}
      />
    </Form.Item>
  )
}

HookForm.Item = HookFormItem

export { HookForm }
