import type { MenuDTO } from '~/api/menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, message, Modal, Select, Switch } from 'antd'
import { useForm } from 'react-hook-form'
import { createMenu, updateMenu } from '~/api/menu'
import { HookForm } from '~/components/HookForm'

interface MenuFormData {
  title: string
  path: string
  icon?: string
  parentId?: number
  sort?: number
  hidden?: boolean
  externalLink?: boolean
  permissionCode: string
}

export const FormMode = {
  Create: 'create',
  Edit: 'edit',
}

interface MenuFormProps {
  open: boolean
  onClose: () => void
  initialData?: MenuDTO
  mode: string
  parentOptions: { value: number, label: string }[]
}

export function MenuForm({
  open,
  onClose,
  initialData,
  mode,
  parentOptions,
}: MenuFormProps) {
  const queryClient = useQueryClient()
  const form = useForm<MenuFormData>({
    defaultValues: initialData || {
      title: '',
      path: '',
      icon: '',
      sort: 0,
      hidden: false,
      externalLink: false,
      permissionCode: '',
    },
    mode: 'onChange',
  })

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
    mutationFn: ({ id, data }: { id: number, data: MenuFormData }) => updateMenu(id, data as MenuDTO),
    onSuccess: () => {
      message.success('菜单更新成功')
      queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
      onClose()
    },
    onError: (error: any) => {
      message.error(error.message || '更新失败')
    },
  })

  const handleSubmit = (data: MenuFormData) => {
    if (!data.title?.trim()) {
      message.error('请输入菜单名称')
      return
    }
    if (!data.path?.trim()) {
      message.error('请输入路由路径')
      return
    }
    if (!data.permissionCode?.trim()) {
      message.error('请输入权限码')
      return
    }

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
            <Input {...field} placeholder="请输入图标类名" />
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

        <HookForm.Item
          name="externalLink"
          label="外链"
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
