import { z } from 'zod'
import { apiClient } from '../common/apiClient'

export const MenuSchema = z.object({
  id: z.number(),
  parentId: z.number().optional().nullable(),
  title: z.string().min(1, '菜单名称不能为空'),
  path: z.string().min(1, '路由路径不能为空'),
  icon: z.string().optional(),
  hidden: z.boolean().optional(),
  keepAlive: z.boolean().optional(),
  externalLink: z.boolean().optional(),
  sort: z.number().optional(),
  permissionCode: z.string().min(1, '权限码不能为空'),
})

export type MenuDTO = z.infer<typeof MenuSchema>
export const MenuSubmitSchema = MenuSchema.omit({ id: true })

export async function fetchMenus() {
  return apiClient<MenuDTO[]>('/sys/menu/list')
}

export async function createMenu(menu: MenuDTO) {
  return apiClient<MenuDTO>('/sys/menu', {
    method: 'POST',
    data: menu,
  })
}

export async function updateMenu(id: number, menu: MenuDTO) {
  return apiClient<MenuDTO>(`/sys/menu/${id}`, {
    method: 'PUT',
    data: menu,
  })
}

export async function deleteMenu(id: number) {
  return apiClient<any>(`/sys/menu/${id}`, {
    method: 'DELETE',
  })
}
