import type { ComponentProps } from 'react'
import type { LoginDTO, LoginResponseDTO } from '../api/auth'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@ago/ui'
import { cn } from '@ago/ui/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { login, LoginSchema } from '~/api/auth'

interface LoginFormProps extends ComponentProps<'div'> {
  onSuccess: (data: LoginResponseDTO) => void
}

export function LoginForm({ className, onSuccess, ...rest }: LoginFormProps) {
  const { t } = useTranslation()

  const loginForm = useForm<LoginDTO>({
    resolver: zodResolver(LoginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginDTO) => login(data),
    onSuccess: (response) => {
      onSuccess(response.data)
    },
    onError: (error: Error) => {
      console.error('Login failed:', error)
    },
  })

  const onSubmit = async (data: LoginDTO) => {
    loginMutation.mutate(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...rest}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t('Login to your account')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('Account')}</Label>
                  <Input
                    id="account"
                    placeholder={t('Input your account')}
                    required
                    {...loginForm.register('username')}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('Password')}</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      {t('Forgot your password?')}
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    {...loginForm.register('password')}
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  {t('Login')}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('Don\'t have an account?')}
                <a href="#" className="underline underline-offset-4">
                  {t('Sign up')}
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
