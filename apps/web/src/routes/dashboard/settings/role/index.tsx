import type { TableColumnsType } from 'antd'
import type { RoleDTO, RoleListDTO } from '~/api/role'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Table } from 'antd'
import { fetchRoles } from '~/api/role'
import { appendActionsMenu } from '~/components/ActionsMenu'
import { usePagination } from '~/hooks/usePagination'

export const Route = createFileRoute('/dashboard/settings/role/')({
  component: RouteComponent,
})

const columns: TableColumnsType<RoleDTO> = [
  {
    title: '角色',
    dataIndex: 'name',
  },
]

function RouteComponent() {
  const { data: roles, isLoading } = useQuery<RoleListDTO>({
    queryKey: ['settings-roles'],
    queryFn: async () => {
      const response = await fetchRoles()
      return response.data
    },
  })

  const columnsWithAction = appendActionsMenu(
    columns,
    [
      {
        key: 'edit',
        label: '编辑',
      },
      {
        type: 'divider',
        key: 'divider',
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
      },
    ],
  )

  const { pagination } = usePagination()

  return (
    <div className="p-4">
      <div className="mb-4 p-4 bg-white rounded-lg">
        <Button type="primary">创建角色</Button>
      </div>
      <Table
        loading={isLoading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.size,
          showSizeChanger: true,
          showTotal: () => `共计 ${roles?.total || 0} 条`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        dataSource={roles?.list || []}
        columns={columnsWithAction}
      />
    </div>
  )
}
