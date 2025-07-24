import type { MenuDTO } from '../api/menu'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'
import { fetchMenus } from '../api/menu'

export interface AppContextValue {
  menus: MenuDTO[] | undefined
  isMenusLoading: boolean
  isMenusError: boolean
  refetchMenus: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
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
    }),
    [menus, isMenusLoading, isMenusError, refetchMenus],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context)
    throw new Error('useAppContext must be used inside AppProvider')
  return context
}
