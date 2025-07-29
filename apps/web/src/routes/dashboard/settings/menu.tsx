import type { MenuDTO } from '~/api/menu'
import { Button } from '@ago/ui/basic/button.tsx'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@ago/ui/basic/dialog.tsx'
import { Input } from '@ago/ui/basic/input.tsx'
import { Label } from '@ago/ui/basic/label.tsx'
import { Switch } from '@ago/ui/basic/switch.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ago/ui/basic/table.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createMenu, deleteMenu, fetchMenus, MenuSchema, updateMenu } from '~/api/menu'

export const Route = createFileRoute('/dashboard/settings/menu')({
  component: RouteComponent,
})

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

  const form = useForm<MenuDTO>({
    resolver: zodResolver(MenuSchema),
    defaultValues: {
      parentId: null,
      title: '',
      path: '',
      icon: '',
      hidden: false,
      keepAlive: true,
      externalLink: false,
      sort: 0,
      permissionCode: '',
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

  const onSubmit = (data: MenuDTO) => {
    if (editingMenu) {
      updateMutation.mutate({ id: editingMenu.id!, menu: data })
    }
    else {
      createMutation.mutate(data)
    }
  }

  const handleEditClick = (menu: MenuDTO) => {
    setEditingMenu(menu)
    form.reset(menu)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    if (false) {
      deleteMutation.mutate(id)
    }
  }

  const handleAddClick = () => {
    setEditingMenu(null)
    form.reset()
    setIsDialogOpen(true)
  }

  if (isLoading)
    return <div>Loading menus...</div>
  if (isError)
    return <div>Error loading menus.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">菜单管理</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleAddClick}>新增菜单</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMenu ? '编辑菜单' : '新增菜单'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">标题</Label>
              <Input id="title" {...form.register('title')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">路径</Label>
              <Input id="path" {...form.register('path')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">图标</Label>
              <Input id="icon" {...form.register('icon')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentId" className="text-right">父级ID</Label>
              <Input id="parentId" type="number" {...form.register('parentId', { valueAsNumber: true })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sort" className="text-right">排序</Label>
              <Input id="sort" type="number" {...form.register('sort', { valueAsNumber: true })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permissionCode" className="text-right">权限码</Label>
              <Input id="permissionCode" {...form.register('permissionCode')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hidden" className="text-right">隐藏</Label>
              <Switch id="hidden" checked={form.watch('hidden')} onCheckedChange={checked => form.setValue('hidden', checked)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keepAlive" className="text-right">保持活跃</Label>
              <Switch id="keepAlive" checked={form.watch('keepAlive')} onCheckedChange={checked => form.setValue('keepAlive', checked)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="externalLink" className="text-right">外部链接</Label>
              <Switch id="externalLink" checked={form.watch('externalLink')} onCheckedChange={checked => form.setValue('externalLink', checked)} className="col-span-3" />
            </div>
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
