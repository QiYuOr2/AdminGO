import type { ComponentProps } from 'react'
import type { LoginDTO, LoginResponseDTO } from '../api/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Button, Input } from 'antd'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { login, LoginSchema } from '~/api/auth'
import { HookForm } from './HookForm'

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

  const onSubmit = (data: LoginDTO) => {
    loginMutation.mutate(data)
  }

  return (
    <div className={`flex flex-col gap-6 text-center ${className}`} {...rest}>
      {t('Login to your account')}
      <HookForm rhf={loginForm} onOk={onSubmit}>
        <div className="grid gap-6">
          <div className="grid">
            <div className="grid gap-3">
              <HookForm.Item
                label={t('Account')}
                name="username"
                render={
                  ({ field }) => (
                    <Input
                      {...field}
                      placeholder={t('Input your account')}
                    />
                  )
                }
              />
            </div>
            <div className="grid gap-3">
              <HookForm.Item
                label={t('Password')}
                name="password"
                render={
                  ({ field }) => (
                    <div className="flex flex-nowrap gap-3 items-center">
                      <Input
                        {...field}
                        type="password"
                      />
                      <a
                        href="#"
                        className="text-nowrap text-sm underline-offset-4 hover:underline"
                      >
                        {t('Forgot your password?')}
                      </a>
                    </div>
                  )
                }
              />
            </div>
            <Button type="primary" block htmlType="submit">
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
      </HookForm>
    </div>
  )
}
