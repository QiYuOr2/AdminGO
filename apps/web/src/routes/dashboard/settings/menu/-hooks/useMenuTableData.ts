import type { MenuDTO } from '~/api/menu'
import { useMemo } from 'react'
import { sortById, sortBySort } from '~/common/utils/menu'

export interface MenuTableVO extends MenuDTO {
  key: string
  children?: MenuTableVO[]
}

export function useMenuTableData(menus: MenuDTO[]) {
  return useMemo<MenuTableVO[]>(() => {
    const menuMap = new Map<number, MenuTableVO>()
    menus.forEach((m) => {
      menuMap.set(m.id, { ...m, key: m.id.toString() })
    })

    const tree: MenuTableVO[] = []
    menus.forEach((m) => {
      if (m.parentId) {
        const parent = menuMap.get(m.parentId)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(menuMap.get(m.id)!)
        }
      }
      else {
        tree.push(menuMap.get(m.id)!)
      }
    })

    const sortChildren = (list: MenuTableVO[]) => {
      list
        .sort(sortById)
        .sort(sortBySort)
      list.forEach((item) => {
        if (item.children) {
          sortChildren(item.children)
        }
      })
    }
    sortChildren(tree)

    return tree
  }, [menus])
}
