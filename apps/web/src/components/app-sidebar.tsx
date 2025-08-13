import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ago/ui'
import { NavMain } from '@ago/ui/nav-main.tsx'
import { NavUser } from '@ago/ui/nav-user.tsx'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import {
  Command,
} from 'lucide-react'
import * as React from 'react'
import { useMemo } from 'react'
import { fetchUserProfile } from '~/api/user'
import { auth } from '~/common/auth'
import { buildSidebarMenu } from '~/common/utils/menu'
import { useAppContext } from '~/contexts/AppContext'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { menus } = useAppContext()
  const location = useLocation()

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    enabled: auth.status === 'loggedIn',
    select: response => response.data,
  })

  const navItems = useMemo(() => {
    return menus
      ? buildSidebarMenu('/dashboard', menus, location.pathname.replace('/dashboard', ''))
      : []
  }, [menus, location.pathname])

  const userData = useMemo(() => {
    if (userProfile) {
      return {
        name: userProfile.name || userProfile.username,
        email: userProfile.email || `${userProfile.username}@example.com`,
        avatar: userProfile.avatar || '/avatars/default.jpg',
      }
    }
    return {
      name: auth.username || 'User',
      email: `${auth.username}@example.com`,
      avatar: '/avatars/default.jpg',
    }
  }, [userProfile])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
