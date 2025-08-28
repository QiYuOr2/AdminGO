import type { MenuDTO } from '~/api/menu'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, message, Modal, Select, Switch } from 'antd'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createMenu, MenuSubmitSchema, updateMenu } from '~/api/menu'
import { HookForm } from '~/components/HookForm'
import { IconSelector } from './IconSelector'

interface MenuEditorData {
  title: string
  path: string
  icon?: string
  parentId?: number | null
  sort?: number
  hidden?: boolean
  externalLink?: boolean
  permissionCode: string
}

interface MenuEditorProps {
  open: boolean
  onClose: () => void
  initialData?: MenuDTO
  mode: string
  parentOptions: { value: number, label: string }[]
}

export const FormMode = {
  Create: 'create',
  Edit: 'edit',
}

const defaultInitialData = {
  title: '',
  path: '',
  icon: '',
  sort: 0,
  hidden: false,
  externalLink: false,
  permissionCode: '',
}

export function MenuEditor({
  open,
  onClose,
  initialData,
  mode,
  parentOptions,
}: MenuEditorProps) {
  const queryClient = useQueryClient()
  const form = useForm<MenuEditorData>({
    resolver: zodResolver(MenuSubmitSchema),
    defaultValues: initialData || defaultInitialData,
    mode: 'onChange',
  })

  useEffect(() => {
    form.reset(initialData || defaultInitialData)
  }, [initialData])

  const createMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      message.success('菜单创建成功')
      queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
      onClose()
      form.reset()
    },
    onError: (error: any) => {
      message.error(error.message || '创建失败')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: MenuEditorData }) => updateMenu(id, data as MenuDTO),
    onSuccess: () => {
      message.success('菜单更新成功')
      queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
      onClose()
    },
    onError: (error: any) => {
      message.error(error.message || '更新失败')
    },
  })

  const handleSubmit = (data: MenuEditorData) => {
    if (mode === FormMode.Create) {
      createMutation.mutate(data as MenuDTO)
    }
    else if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data })
    }
  }

  const handleCancel = () => {
    form.reset()
    onClose()
  }

  return (
    <Modal
      title={mode === FormMode.Create ? '创建菜单' : '编辑菜单'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <HookForm
        className="mt-4"
        rhf={form}
        onOk={handleSubmit}
        labelCol={{ span: 4 }}
        layout="vertical"
      >
        <HookForm.Item
          name="title"
          label="菜单名称"
          required
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="请输入菜单名称" />
              {fieldState.error && (
                <div className="text-red-500 text-sm mt-1">{fieldState.error.message}</div>
              )}
            </>
          )}
        />

        <HookForm.Item
          name="path"
          label="路由路径"
          required
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="请输入路由路径" />
              {fieldState.error && (
                <div className="text-red-500 text-sm mt-1">{fieldState.error.message}</div>
              )}
            </>
          )}
        />

        <HookForm.Item
          name="icon"
          label="图标"
          render={({ field }) => (
            <IconSelector {...field} placeholder="请选择菜单图标" />
          )}
        />

        <HookForm.Item
          name="parentId"
          label="父级菜单"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="选择父级菜单"
              allowClear
              options={parentOptions}
            />
          )}
        />

        <HookForm.Item
          name="sort"
          label="排序"
          render={({ field }) => (
            <InputNumber {...field} placeholder="排序" min={0} />
          )}
        />

        <HookForm.Item
          name="permissionCode"
          label="权限码"
          required
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="请输入权限码" />
              {fieldState.error && (
                <div className="text-red-500 text-sm mt-1">{fieldState.error.message}</div>
              )}
            </>
          )}
        />

        <HookForm.Item
          name="hidden"
          label="隐藏菜单"
          render={({ field }) => (
            <Switch {...field} checked={field.value} />
          )}
        />

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {mode === FormMode.Create ? '创建' : '更新'}
            </Button>
          </div>
        </Form.Item>
      </HookForm>
    </Modal>
  )
}
