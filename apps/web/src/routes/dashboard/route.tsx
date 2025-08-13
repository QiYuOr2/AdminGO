import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ago/ui/basic/breadcrumb.tsx'
import { Separator } from '@ago/ui/basic/separator.tsx'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@ago/ui/basic/sidebar.tsx'
import { cn } from '@ago/ui/utils'
import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { buildBreadcrumbs } from '~/common/utils/menu'
import { AppSidebar } from '~/components/app-sidebar.tsx'
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
  const { menus } = useAppContext()
  const location = useLocation()
  const breadcrumbs = useMemo(() => {
    return menus ? buildBreadcrumbs(menus, location.pathname) : []
  }, [menus, location.pathname])

  const BreadcrumbNav = () => (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index, array) => (
          <div key={item.path} className="flex items-center gap-3">
            <BreadcrumbItem className={index < breadcrumbs.length - 1 ? 'hidden md:block' : ''}>
              {index < breadcrumbs.length - 1
                ? <BreadcrumbLink href={item.path}>{item.title}</BreadcrumbLink>
                : <BreadcrumbPage>{item.title}</BreadcrumbPage>}
            </BreadcrumbItem>
            {
              array.length - 1 > index
              && <BreadcrumbSeparator className="hidden md:block" />
            }
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <BreadcrumbNav />
            </div>
          </header>
          <div className={cn('flex-1 overflow-y-auto px-4')}>
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
