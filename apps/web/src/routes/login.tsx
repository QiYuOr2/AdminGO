import type { LoginResponseDTO } from '~/api/auth'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { LoginForm } from '../components/login-form'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.auth.userId) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

export default function LoginPage() {
  const router = useRouter()
  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth }),
  })
  const onLoginSuccess = (data: LoginResponseDTO) => {
    auth.login(data.username, data.userId)
    router.invalidate()
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm onSuccess={onLoginSuccess} />
      </div>
    </div>
  )
}
