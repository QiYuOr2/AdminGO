import z from 'zod'
import { apiClient } from '~/common/apiClient'
import { PermissionSchema } from './permission'

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  permissions: z.array(PermissionSchema),
})

export type RoleDTO = z.infer<typeof RoleSchema>

export const RoleListDTOSchema = z.object({
  list: z.array(RoleSchema),
  total: z.number(),
})

export type RoleListDTO = z.infer<typeof RoleListDTOSchema>

export function fetchRoles(page = 1, size = 10) {
  return apiClient<RoleListDTO>(`/sys/role?page=${page}&size=${size}`)
}
