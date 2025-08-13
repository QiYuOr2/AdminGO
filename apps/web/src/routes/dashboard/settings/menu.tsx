import type { MenuDTO } from '~/api/menu'
import type { FormConfig } from '~/components/schema-form/types'
import { Button } from '@ago/ui/basic/button.tsx'
import { DialogTrigger } from '@ago/ui/basic/dialog.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ago/ui/basic/table.tsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { createMenu, deleteMenu, fetchMenus, MenuSchema, updateMenu } from '~/api/menu'
import { FormDialog } from '../-components/form-dialog'

export const Route = createFileRoute('/dashboard/settings/menu')({
  component: RouteComponent,
})

const menuFormConfig: FormConfig<typeof MenuSchema> = {
  fields: [
    {
      name: 'title',
      label: '标题',
      type: 'text',
      required: true,
      placeholder: '请输入菜单标题',
    },
    {
      name: 'path',
      label: '路径',
      type: 'text',
      required: true,
      placeholder: '请输入菜单路径',
    },
    {
      name: 'icon',
      label: '图标',
      type: 'text',
      placeholder: '请输入图标名称',
    },
    {
      name: 'parentId',
      label: '父级ID',
      type: 'number',
      placeholder: '请输入父级菜单ID',
    },
    {
      name: 'sort',
      label: '排序',
      type: 'number',
      defaultValue: 0,
      placeholder: '请输入排序值',
    },
    {
      name: 'permissionCode',
      label: '权限码',
      type: 'text',
      placeholder: '请输入权限码',
    },
    {
      name: 'hidden',
      label: '隐藏',
      type: 'checkbox',
      defaultValue: false,
      description: '是否在菜单中隐藏此项',
    },
    {
      name: 'keepAlive',
      label: '保持活跃',
      type: 'checkbox',
      defaultValue: true,
      description: '页面是否保持缓存状态',
    },
    {
      name: 'externalLink',
      label: '外部链接',
      type: 'checkbox',
      defaultValue: false,
      description: '是否为外部链接',
    },
  ],
  validationSchema: MenuSchema,
  resetOnSubmit: true,
}

function RouteComponent() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuDTO | null>(null)

  const { data: menus, isLoading, isError } = useQuery<MenuDTO[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const response = await fetchMenus()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setIsDialogOpen(false)
      toast('菜单创建成功')
    },
    onError: (error) => {
      console.error('Error create menu:', error)
      toast('菜单创建失败')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, menu: MenuDTO }) => updateMenu(data.id, data.menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setIsDialogOpen(false)
      toast('菜单更新成功')
    },
    onError: (error) => {
      console.error('Error updating menu:', error)
      toast('菜单更新失败')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      toast('菜单删除成功')
    },
    onError: (error) => {
      console.error('Error delete menu:', error)
      toast('菜单删除失败')
    },
  })

  const formConfig: FormConfig<typeof MenuSchema> = {
    ...menuFormConfig,
    onSubmit: async (data: Record<string, any>) => {
      if (editingMenu) {
        updateMutation.mutate({ id: editingMenu.id!, menu: data as MenuDTO })
      }
      else {
        createMutation.mutate(data as MenuDTO)
      }
    },
  }

  const handleEditClick = (menu: MenuDTO) => {
    setEditingMenu(menu)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    if (false) {
      deleteMutation.mutate(id)
    }
  }

  const handleAddClick = () => {
    setEditingMenu(null)
    setIsDialogOpen(true)
  }

  if (isLoading)
    return <div>Loading menus...</div>
  if (isError)
    return <div>Error loading menus.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">菜单管理</h1>
      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingMenu ? '编辑菜单' : '新增菜单'}
        config={formConfig}
        initialValues={editingMenu || undefined}
      >
        <DialogTrigger asChild>
          <Button onClick={handleAddClick}>新增菜单</Button>
        </DialogTrigger>
      </FormDialog>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>标题</TableHead>
            <TableHead>路径</TableHead>
            <TableHead>图标</TableHead>
            <TableHead>父级ID</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>隐藏</TableHead>
            <TableHead>保持活跃</TableHead>
            <TableHead>外部链接</TableHead>
            <TableHead>权限码</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus?.map(menu => (
            <TableRow key={menu.id}>
              <TableCell>{menu.id}</TableCell>
              <TableCell>{menu.title}</TableCell>
              <TableCell>{menu.path}</TableCell>
              <TableCell>{menu.icon}</TableCell>
              <TableCell>{menu.parentId ?? '无'}</TableCell>
              <TableCell>{menu.sort}</TableCell>
              <TableCell>{menu.hidden ? '是' : '否'}</TableCell>
              <TableCell>{menu.keepAlive ? '是' : '否'}</TableCell>
              <TableCell>{menu.externalLink ? '是' : '否'}</TableCell>
              <TableCell>{menu.permissionCode}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(menu)}>编辑</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(menu.id!)}>删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
