import type { NavMainItem } from '@ago/ui/nav-main.tsx'
import type { MenuDTO } from '~/api/menu'
import { Command } from 'lucide-react'

export function buildSidebarMenu(basic: string, menus: MenuDTO[]): NavMainItem[] {
  const rootMenus = menus.filter(m => m.parentId === null)
  const childrenMap = new Map<number, MenuDTO[]>()

  for (const m of menus) {
    if (m.parentId !== null) {
      if (!childrenMap.has(m.parentId)) {
        childrenMap.set(m.parentId, [])
      }
      childrenMap.get(m.parentId)!.push(m)
    }
  }

  return rootMenus.map(root => ({
    title: root.title,
    url: `${basic}${root.path}`,
    icon: Command,
    isActive: false,
    items: childrenMap.get(root.id)?.map(child => ({
      title: child.title,
      url: `${basic}${child.path}`,
    })),
  }))
}
