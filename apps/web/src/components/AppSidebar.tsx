import type { ComponentProps } from 'react'
// import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Divider, Layout, Menu } from 'antd'
import { useMemo } from 'react'
import { DASHBOARD_PATH } from '~/common/constants'
import { cn } from '~/common/utils/cn'
// import { fetchUserProfile } from '~/api/user'
// import { auth } from '~/common/auth'
import { buildMenu } from '~/common/utils/menu'
import { omit } from '~/common/utils/object'
import { useAppContext } from '~/contexts/AppContext'
import { NavUser } from './NavUser'

export function AppSidebar({ children, ...rest }: ComponentProps<'div'>) {
  const { menus, collapsed } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = useMemo(() => {
    const formattedMenus = (menus
      ? buildMenu(
          DASHBOARD_PATH,
          menus,
          location.pathname.replace(DASHBOARD_PATH, ''),
        )
      : [])

    return formattedMenus.map(item => ({
      ...item,
      icon: <div className={cn(item.icon, 'text-xl h-[1em]')}></div>,
      children: item.children?.map(child => omit(child, 'icon')),
    }))
  }, [menus, location.pathname])

  // const { data: userProfile } = useQuery({
  //   queryKey: ['userProfile'],
  //   queryFn: fetchUserProfile,
  //   enabled: auth.status === 'loggedIn',
  //   select: response => response.data,
  // })

  // const userData = useMemo(() => {
  //   if (userProfile) {
  //     return {
  //       name: userProfile.name || userProfile.username,
  //       email: userProfile.email || `${userProfile.username}@example.com`,
  //       avatar: userProfile.avatar || '/avatars/default.jpg',
  //     }
  //   }
  //   return {
  //     name: auth.username || 'User',
  //     email: `${auth.username}@example.com`,
  //     avatar: '/avatars/default.jpg',
  //   }
  // }, [userProfile])

  const handleMenuSelect = ({ key }: { key: string }) => {
    const selectedMenu = menus?.find(menu => String(menu.id) === key)

    if (selectedMenu) {
      navigate({ to: `${DASHBOARD_PATH}${selectedMenu.path}` })
    }
  }

  const selectedMenu = useMemo(() => {
    return menus?.find(menu => menu.path === location.pathname.replace(DASHBOARD_PATH, ''))
  }, [location.pathname, menus])

  const openKeys = useMemo(() => {
    const parentMenu = menus?.find(menu => menu.id === selectedMenu?.parentId)
    return parentMenu ? [String(parentMenu.id)] : []
  }, [selectedMenu, menus])

  return (
    <Layout.Sider theme="light" collapsed={collapsed} {...rest}>
      <div className="flex flex-col h-full">
        <div className="my-2 mx-4 font-bold bg-warmGray-100 py-4 text-center rounded">
          { collapsed ? 'AGO' : 'AdminGO' }
        </div>
        <Menu
          className="flex-1 overflow-y-auto scrollbar scrollbar-thin scrollbar-track-color-white scrollbar-rounded"
          mode="inline"
          items={navItems}
          defaultSelectedKeys={selectedMenu ? [String(selectedMenu.id)] : []}
          defaultOpenKeys={openKeys}
          onSelect={handleMenuSelect}
        />
        <div className="mt-auto">
          <Divider className="m-0" />
          <NavUser collapsed={collapsed} />
        </div>
      </div>
    </Layout.Sider>
  )
}
