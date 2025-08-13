import { z } from 'zod'
import { apiClient } from '../common/apiClient'

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
  name: z.string().optional(),
})

export type UserDTO = z.infer<typeof UserSchema>

export async function fetchUserProfile() {
  // return apiClient<UserDTO>('/user/profile')
  return new Promise(resolve => resolve(1)) as any
}

export async function updateUserProfile(data: Partial<UserDTO>) {
  return apiClient<UserDTO>('/user/profile', {
    method: 'PUT',
    data,
  })
}
