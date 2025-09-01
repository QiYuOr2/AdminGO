import type { TableColumnsType } from 'antd'
import type { RoleDTO, RoleListDTO } from '~/api/role'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Table } from 'antd'
import { useState } from 'react'
import { fetchRoles } from '~/api/role'
import { appendActionsMenu } from '~/components/ActionsMenu'

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
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const onPaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    setSize(pageSize)
  }

  const { data: roles, isLoading } = useQuery<RoleListDTO>({
    queryKey: ['settings-roles', page, size],
    queryFn: async () => {
      const response = await fetchRoles(page, size)
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

  return (
    <div className="p-4">
      <div className="mb-4 p-4 bg-white rounded-lg">
        <Button type="primary">创建角色</Button>
      </div>
      <Table
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: size,
          onChange: onPaginationChange,
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
