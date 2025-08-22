import type { MenuItemType } from 'antd/es/menu/interface'
import type { MenuDTO } from '~/api/menu'

function sortById(a: { id: number }, b: { id: number }): number {
  return a.id - b.id
}

export interface MenuItem extends MenuItemType {
  key: string
  label: string
  icon: string
  url?: string
  isActive?: boolean
  children?: MenuItem[]
}
export function buildMenu(basic: string, menus: MenuDTO[], currentPath?: string) {
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

  const mapToMenuItem = (menu: MenuDTO): MenuItem => {
    const children = childrenMap.get(menu.id)?.sort(sortById).map(mapToMenuItem)
    return {
      key: `${menu.id}`, // key 必须是 string
      label: menu.title,
      icon: '', // 先占位
      children: children?.length ? children : undefined,
      isActive: activeIds.includes(menu.id), // 可选，辅助高亮逻辑
      url: `${basic}${menu.path}`, // 可选，用于点击跳转
    }
  }

  return rootMenus.sort(sortById).map(mapToMenuItem)
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
