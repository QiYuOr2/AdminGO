import type { MenuDTO } from '../api/menu'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { fetchMenus } from '../api/menu'

interface MenuContext {
  menus: MenuDTO[] | undefined
  isMenusLoading: boolean
  isMenusError: boolean
  refetchMenus: () => void
}

interface GlobalStateContext {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export interface AppContextValue extends MenuContext, GlobalStateContext {}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  const {
    data: menus,
    isLoading: isMenusLoading,
    isError: isMenusError,
    refetch: refetchMenus,
  } = useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const response = await fetchMenus()
      return response.data
    },
    staleTime: 1000 * 60 * 5,
  })

  const value = useMemo<AppContextValue>(
    () => ({
      menus,
      isMenusLoading,
      isMenusError,
      refetchMenus,

      collapsed,
      setCollapsed,
    }),
    [menus, isMenusLoading, isMenusError, refetchMenus, collapsed, setCollapsed],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context)
    throw new Error('useAppContext must be used inside AppProvider')
  return context
}
