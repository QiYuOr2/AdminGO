import type { RouterContext } from '../types/router-context'
import { Toaster } from '@ago/ui/basic/sonner.tsx'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})
