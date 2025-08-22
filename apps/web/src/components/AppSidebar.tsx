import type { ComponentProps } from 'react'
// import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Layout, Menu } from 'antd'
import { useMemo } from 'react'
import { DASHBOARD_PATH } from '~/common/constants'
// import { fetchUserProfile } from '~/api/user'
// import { auth } from '~/common/auth'
import { buildMenu } from '~/common/utils/menu'
import { useAppContext } from '~/contexts/AppContext'

export function AppSidebar({ children, ...rest }: ComponentProps<'div'>) {
  const { menus } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  // const { data: userProfile } = useQuery({
  //   queryKey: ['userProfile'],
  //   queryFn: fetchUserProfile,
  //   enabled: auth.status === 'loggedIn',
  //   select: response => response.data,
  // })

  const navItems = useMemo(() => {
    return menus
      ? buildMenu(
          DASHBOARD_PATH,
          menus,
          location.pathname.replace(DASHBOARD_PATH, ''),
        )
      : []
  }, [menus, location.pathname])

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
    <Layout.Sider theme="light" {...rest}>
      <div className="my-2 mx-4 bg-warmGray-100 py-4 text-center rounded">AdminGO</div>
      <Menu
        mode="inline"
        items={navItems}
        defaultSelectedKeys={selectedMenu ? [String(selectedMenu.id)] : []}
        defaultOpenKeys={openKeys}
        onSelect={handleMenuSelect}
      />
    </Layout.Sider>
  )
}
