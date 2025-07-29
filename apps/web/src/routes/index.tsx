import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth.userId) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

function RouteComponent() {
  return <Navigate to="/login" />
}
