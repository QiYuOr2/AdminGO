import { z } from 'zod'
import { apiClient } from '../common/apiClient'

export const MenuSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  title: z.string(),
  path: z.string(),
  icon: z.string(),
  hidden: z.boolean(),
  keepAlive: z.boolean(),
  externalLink: z.boolean(),
  sort: z.number().optional(),
})

export type MenuDTO = z.infer<typeof MenuSchema>

export async function fetchMenus() {
  return apiClient<MenuDTO[]>('/sys/menu/list')
}
