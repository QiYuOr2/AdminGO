import type { TableColumnsType } from 'antd'
import type { MenuTableVO } from './-hooks/useMenuTableData'
import type { MenuDTO } from '~/api/menu'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { message, Table } from 'antd'
import { fetchMenus } from '~/api/menu'
import { DEFAULT_MENU_ICON } from '~/common/constants'
import { cn } from '~/common/utils/cn'
import { appendActionsMenu } from '../-components/ActionsMenu'
import { useMenuTableData } from './-hooks/useMenuTableData'

export const Route = createFileRoute('/dashboard/settings/menu')({
  component: RouteComponent,
})

const columns: TableColumnsType<MenuTableVO> = [
  {
    title: '名称',
    dataIndex: 'title',
  },
  {
    title: '路由',
    dataIndex: 'path',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    render: (icon: string) => <div className={cn(icon || DEFAULT_MENU_ICON, 'text-xl h-[1em]')}></div>,
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '隐藏',
    dataIndex: 'hidden',
    render: (hidden?: boolean) => (hidden ? '是' : '否'),
  },
  {
    title: '权限码',
    dataIndex: 'permissionCode',
  },
]

function RouteComponent() {
  const columnsWithAction = appendActionsMenu(
    columns,
    [
      {
        key: 'edit',
        label: '编辑',
        onActionClick: (data) => {
          message.info(`编辑${data.title}`)
        },
      },
      {
        type: 'divider',
        key: 'divider',
      },
      {
        key: 'delete',
        label: '删除',
        onActionClick: (data) => {
          message.info(`删除${data.title}`)
        },
      },
    ],
  )

  // const queryClient = useQueryClient()

  const { data: menus, isLoading } = useQuery<MenuDTO[]>({
    queryKey: ['settings-menus'],
    queryFn: async () => {
      const response = await fetchMenus()
      return response.data
    },
  })

  const dataSource = useMenuTableData(menus || [])

  // const createMutation = useMutation({
  //   mutationFn: createMenu,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
  //     queryClient.invalidateQueries({ queryKey: ['menus'] })
  //     setIsFormDialogOpen(false)
  //     toast('菜单创建成功')
  //   },
  //   onError: (error) => {
  //     console.error('Error create menu:', error)
  //     toast.error('菜单创建失败')
  //   },
  // })

  // const updateMutation = useMutation({
  //   mutationFn: (data: { id: number, menu: MenuDTO }) => updateMenu(data.id, data.menu),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
  //     queryClient.invalidateQueries({ queryKey: ['menus'] })
  //     setIsFormDialogOpen(false)
  //     toast('菜单更新成功')
  //   },
  //   onError: (error) => {
  //     console.error('Error updating menu:', error)
  //     toast('菜单更新失败')
  //   },
  // })

  // const deleteMutation = useMutation({
  //   mutationFn: deleteMenu,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
  //     queryClient.invalidateQueries({ queryKey: ['menus'] })
  //     toast('菜单删除成功')
  //   },
  //   onError: (error) => {
  //     console.error('Error delete menu:', error)
  //     toast('菜单删除失败')
  //   },
  // })

  return (
    <div className="p-4">
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columnsWithAction}
        pagination={false}
      />
    </div>
  )
}
