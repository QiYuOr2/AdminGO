import type { MenuDTO } from '~/api/menu'
import type { FormConfig } from '~/components/schema-form/types'
import { Button } from '@ago/ui/basic/button.tsx'
import { DialogTrigger } from '@ago/ui/basic/dialog.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@ago/ui/basic/dropdown-menu.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ago/ui/basic/table.tsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { createMenu, deleteMenu, fetchMenus, MenuSubmitSchema, updateMenu } from '~/api/menu'
import { syncFunctions } from '~/components/schema-form/field-sync'
import { FormDialog } from '../-components/form-dialog'

export const Route = createFileRoute('/dashboard/settings/menu')({
  component: RouteComponent,
})

const menuFormConfig: FormConfig<typeof MenuSubmitSchema> = {
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
      placeholder: '将根据路径自动生成',
      description: '权限码会根据菜单路径自动生成，也可以手动修改',
      syncWith: [
        {
          type: 'transform',
          sourceField: 'path',
          transform: (pathValue: string) => {
            return syncFunctions.pathToPermissionCode(pathValue)
          },
          condition: (pathValue: string) => Boolean(pathValue && pathValue.trim()),
        },
      ],
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
  validationSchema: MenuSubmitSchema,
  resetOnSubmit: true,
}

function RouteComponent() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuDTO | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())

  const { data: menus, isLoading, isError } = useQuery<MenuDTO[]>({
    queryKey: ['settings-menus'],
    queryFn: async () => {
      const response = await fetchMenus()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-menus', 'menus'] })
      setIsDialogOpen(false)
      toast('菜单创建成功')
    },
    onError: (error) => {
      console.error('Error create menu:', error)
      toast.error('菜单创建失败')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, menu: MenuDTO }) => updateMenu(data.id, data.menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-menus', 'menus'] })
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
      queryClient.invalidateQueries({ queryKey: ['settings-menus', 'menus'] })
      toast('菜单删除成功')
    },
    onError: (error) => {
      console.error('Error delete menu:', error)
      toast('菜单删除失败')
    },
  })

  const formConfig: FormConfig<typeof MenuSubmitSchema> = {
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

  const toggleNode = (menuId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      }
      else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  type MenuWithChildren = MenuDTO & { children: MenuWithChildren[] }

  const organizeMenuHierarchy = (menus: MenuDTO[]): MenuWithChildren[] => {
    const menuMap = new Map<number, MenuWithChildren>()
    const rootMenus: MenuWithChildren[] = []

    menus.forEach((menu) => {
      menuMap.set(menu.id!, { ...menu, children: [] })
    })

    menus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id!)!
      if (menu.parentId && menuMap.has(menu.parentId)) {
        menuMap.get(menu.parentId)!.children.push(menuWithChildren)
      }
      else {
        rootMenus.push(menuWithChildren)
      }
    })

    const sortMenus = (menuList: MenuWithChildren[]) => {
      menuList.sort((a, b) => (a.sort || 0) - (b.sort || 0))
      menuList.forEach(menu => sortMenus(menu.children))
    }
    sortMenus(rootMenus)

    return rootMenus
  }

  const renderMenuRows = (menuList: MenuWithChildren[], level: number = 0): React.ReactNode[] => {
    const rows: React.ReactNode[] = []

    menuList.forEach((menu) => {
      const hasChildren = menu.children.length > 0
      const isExpanded = expandedNodes.has(menu.id!)
      const paddingLeft = level * 20

      rows.push(
        <TableRow key={menu.id}>
          <TableCell>
            <div className="flex items-center" style={{ paddingLeft: `${paddingLeft}px` }}>
              {hasChildren
                ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-4 w-4 mr-2"
                      onClick={() => toggleNode(menu.id!)}
                    >
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </Button>
                  )
                : (
                    <div className="w-6 mr-2" />
                  )}
              {menu.title}
            </div>
          </TableCell>
          <TableCell>{menu.path}</TableCell>
          <TableCell>{menu.icon}</TableCell>
          <TableCell>{menu.sort}</TableCell>
          <TableCell>{menu.hidden ? '是' : '否'}</TableCell>
          <TableCell>{menu.keepAlive ? '是' : '否'}</TableCell>
          <TableCell>{menu.externalLink ? '是' : '否'}</TableCell>
          <TableCell>{menu.permissionCode}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm"><Ellipsis /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleEditClick(menu)}>
                  编辑
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(menu.id!)}>
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>,
      )

      // Render children if expanded
      if (hasChildren && isExpanded) {
        rows.push(...renderMenuRows(menu.children, level + 1))
      }
    })

    return rows
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
            <TableHead>标题</TableHead>
            <TableHead>路径</TableHead>
            <TableHead>图标</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>隐藏</TableHead>
            <TableHead>保持活跃</TableHead>
            <TableHead>外部链接</TableHead>
            <TableHead>权限码</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus && renderMenuRows(organizeMenuHierarchy(menus))}
        </TableBody>
      </Table>
    </div>
  )
}
