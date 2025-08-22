import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings/menu')({
  component: RouteComponent,
})

function RouteComponent() {
  // const queryClient = useQueryClient()

  // const { data: menus, isLoading, isError } = useQuery<MenuDTO[]>({
  //   queryKey: ['settings-menus'],
  //   queryFn: async () => {
  //     const response = await fetchMenus()
  //     return response.data
  //   },
  // })

  // const createMutation = useMutation({
  //   mutationFn: createMenu,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
  //     queryClient.invalidateQueries({ queryKey: ['menus'] })
  //     setIsFormDialogOpen(false)
  //     toast('菜单创建成功')
  //   },
  //   onError: (error) => {
  //     console.error('Error create menu:', error)
  //     toast.error('菜单创建失败')
  //   },
  // })

  // const updateMutation = useMutation({
  //   mutationFn: (data: { id: number, menu: MenuDTO }) => updateMenu(data.id, data.menu),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
  //     queryClient.invalidateQueries({ queryKey: ['menus'] })
  //     setIsFormDialogOpen(false)
  //     toast('菜单更新成功')
  //   },
  //   onError: (error) => {
  //     console.error('Error updating menu:', error)
  //     toast('菜单更新失败')
  //   },
  // })

  // const deleteMutation = useMutation({
  //   mutationFn: deleteMenu,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['settings-menus'] })
  //     queryClient.invalidateQueries({ queryKey: ['menus'] })
  //     toast('菜单删除成功')
  //   },
  //   onError: (error) => {
  //     console.error('Error delete menu:', error)
  //     toast('菜单删除失败')
  //   },
  // })

  // if (isLoading)
  //   return <div>Loading menus...</div>
  // if (isError)
  //   return <div>Error loading menus.</div>

  return (
    <div className="p-4">

    </div>
  )
}
