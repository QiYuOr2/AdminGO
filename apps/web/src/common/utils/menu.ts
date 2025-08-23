import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import type { MenuItemType } from 'antd/es/menu/interface'
import type { MenuDTO } from '~/api/menu'

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
    const children = childrenMap
      .get(menu.id)
      ?.sort(sortById)
      .sort(sortBySort)
      .map(mapToMenuItem)

    return {
      key: `${menu.id}`,
      label: menu.title,
      icon: menu.icon || 'i-fluent:border-none-24-filled',
      children: children?.length ? children : undefined,
      isActive: activeIds.includes(menu.id),
      url: `${basic}${menu.path}`, // 可选，用于点击跳转
    }
  }

  return rootMenus
    .sort(sortById)
    .sort(sortBySort)
    .map(mapToMenuItem)
}

export function buildBreadcrumbs(menus: MenuDTO[], currentPath: string): BreadcrumbItemType[] {
  const breadcrumbs: BreadcrumbItemType[] = []
  const menuMap = new Map<number, MenuDTO>(menus.map(m => [m.id, m]))

  const relativePath = currentPath.replace('/dashboard', '')

  let currentMenu = menus.find(m => m.path === relativePath)

  while (currentMenu) {
    breadcrumbs.unshift({ title: currentMenu.title })
    if (currentMenu.parentId) {
      currentMenu = menuMap.get(currentMenu.parentId)
    }
    else {
      currentMenu = undefined
    }
  }
  return breadcrumbs
}

export function sortBySort(a: MenuDTO, b: MenuDTO) {
  return (a.sort ?? 0) - (b.sort ?? 0)
}

export function sortById(a: MenuDTO, b: MenuDTO) {
  return a.id - b.id
}
