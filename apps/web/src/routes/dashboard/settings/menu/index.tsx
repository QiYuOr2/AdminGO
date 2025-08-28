import type { TableColumnsType } from 'antd'
import type { MenuTableVO } from './-hooks/useMenuTableData'
import type { MenuDTO } from '~/api/menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button, message, Modal, Table } from 'antd'
import { useState } from 'react'
import { deleteMenu, fetchMenus } from '~/api/menu'
import { DEFAULT_MENU_ICON } from '~/common/constants'
import { cn } from '~/common/utils/cn'
import { appendActionsMenu } from '../../-components/ActionsMenu'
import { FormMode, MenuEditor } from './-components/MenuEditor'
import { useMenuTableData } from './-hooks/useMenuTableData'

export const Route = createFileRoute('/dashboard/settings/menu/')({
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
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuDTO | null>(null)
  const [formMode, setFormMode] = useState<string>(FormMode.Create)
  const queryClient = useQueryClient()

  const { data: menus, isLoading } = useQuery<MenuDTO[]>({
    queryKey: ['settings-menus'],
    queryFn: async () => {
      const response = await fetchMenus()
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      message.success('菜单删除成功')
      queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
    },
    onError: (error: any) => {
      message.error(error.message || '删除失败')
    },
  })

  const handleCreateMenu = () => {
    setFormMode(FormMode.Create)
    setEditingMenu(null)
    setModalOpen(true)
  }

  const handleEditMenu = (menu: MenuDTO) => {
    setFormMode(FormMode.Edit)
    setEditingMenu(() => ({ ...menu }))
    setModalOpen(true)
  }

  const handleDeleteMenu = (menu: MenuDTO) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除菜单 ${menu.title} 吗？此操作不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        deleteMutation.mutate(menu.id)
      },
    })
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingMenu(null)
  }

  const columnsWithAction = appendActionsMenu(
    columns,
    [
      {
        key: 'edit',
        label: '编辑',
        onActionClick: handleEditMenu,
      },
      {
        type: 'divider',
        key: 'divider',
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
        onActionClick: handleDeleteMenu,
      },
    ],
  )

  const dataSource = useMenuTableData(menus || [])

  // 生成父级菜单选项
  const parentOptions = (menus || []).map(menu => ({
    value: menu.id,
    label: menu.title,
  }))

  return (
    <div className="p-4">
      <div className="mb-4 p-4 bg-white rounded-lg">
        <Button type="primary" onClick={handleCreateMenu}>创建菜单</Button>
      </div>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columnsWithAction}
        pagination={false}
      />

      <MenuEditor
        open={modalOpen}
        onClose={handleModalClose}
        initialData={editingMenu || undefined}
        mode={formMode}
        parentOptions={parentOptions}
      />
    </div>
  )
}
