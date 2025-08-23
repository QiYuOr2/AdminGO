import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { Breadcrumb, Divider, Layout, theme } from 'antd'
import { useMemo } from 'react'
import { buildBreadcrumbs } from '~/common/utils/menu'
import { AppSidebar } from '~/components/AppSidebar'
import { useAppContext } from '~/contexts/AppContext'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.userId) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const { menus, collapsed, setCollapsed } = useAppContext()
  const location = useLocation()
  const breadcrumbs = useMemo(() => {
    return menus ? buildBreadcrumbs(menus, location.pathname) : []
  }, [menus, location.pathname])

  const toggleCollpased = () => setCollapsed(!collapsed)

  return (
    <Layout className="h-vh">
      <AppSidebar />

      <Layout>
        <Layout.Header
          className="flex items-center px-6"
          style={{ background: colorBgContainer }}
        >
          <div
            className="cursor-pointer hover:bg-warmGray-100 rounded p-1  transition-colors duration-200"
            onClick={toggleCollpased}
          >
            <div className="i-fluent:panel-left-32-regular text-lg"></div>
          </div>
          <Divider type="vertical" className="ml-2 mr-3" />
          <Breadcrumb items={breadcrumbs} />
        </Layout.Header>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
