import type { NavMainItem } from '@ago/ui/nav-main.tsx'
import type { MenuDTO } from '~/api/menu'
import { Command } from 'lucide-react'

function sortById(a: { id: number }, b: { id: number }): number {
  return a.id - b.id
}

export function buildSidebarMenu(basic: string, menus: MenuDTO[], currentPath?: string): NavMainItem[] {
  const rootMenus = menus.filter(m => m.parentId === null)
  const childrenMap = new Map<number, MenuDTO[]>()

  const activeIds: number[] = []
  for (const m of menus) {
    if (currentPath && m.path === currentPath) {
      activeIds.push(m.id)
    }
    if (m.parentId) {
      if (activeIds.includes(m.id)) {
        activeIds.push(m.parentId)
      }
      if (!childrenMap.has(m.parentId)) {
        childrenMap.set(m.parentId, [])
      }
      childrenMap.get(m.parentId)!.push(m)
    }
  }

  return rootMenus.map((root) => {
    return {
      id: root.id,
      title: root.title,
      url: `${basic}${root.path}`,
      icon: Command,
      isActive: activeIds.includes(root.id),
      items: childrenMap.get(root.id)?.map(child => ({
        id: child.id,
        title: child.title,
        url: `${basic}${child.path}`,
        isActive: activeIds.includes(child.id),
      })).sort(sortById),
    }
  }).sort(sortById)
}

export interface BreadcrumbItemData {
  title: string
  path: string
}

export function buildBreadcrumbs(menus: MenuDTO[], currentPath: string): BreadcrumbItemData[] {
  const breadcrumbs: BreadcrumbItemData[] = []
  const menuMap = new Map<number, MenuDTO>(menus.map(m => [m.id, m]))

  const relativePath = currentPath.replace('/dashboard', '')

  let currentMenu = menus.find(m => m.path === relativePath)

  while (currentMenu) {
    breadcrumbs.unshift({ title: currentMenu.title, path: `/dashboard${currentMenu.path}` })
    if (currentMenu.parentId) {
      currentMenu = menuMap.get(currentMenu.parentId)
    }
    else {
      currentMenu = undefined
    }
  }
  return breadcrumbs
}
