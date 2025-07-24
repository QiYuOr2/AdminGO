import { z } from 'zod'
import { apiClient } from '../common/apiClient'
import { AUTH_TOKEN_KEY, AUTH_USER_ID_KEY, AUTH_USERNAME_KEY } from '../common/constants'

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export type LoginDTO = z.infer<typeof LoginSchema>

export interface LoginResponseDTO {
  token: string
  username: string
  userId: number
}

export async function login(credentials: LoginDTO) {
  LoginSchema.parse(credentials)

  const response = await apiClient<LoginResponseDTO>('/login', {
    method: 'POST',
    data: credentials,
  })

  localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
  localStorage.setItem(AUTH_USERNAME_KEY, response.data.username)
  localStorage.setItem(AUTH_USER_ID_KEY, response.data.userId.toString())

  return response
}

export async function register(payload: LoginDTO) {
  LoginSchema.parse(payload)

  const response = await apiClient<LoginResponseDTO>('/register', {
    method: 'POST',
    data: payload,
  })

  localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
  localStorage.setItem(AUTH_USERNAME_KEY, response.data.username)
  localStorage.setItem(AUTH_USER_ID_KEY, response.data.userId.toString())

  return response
}
