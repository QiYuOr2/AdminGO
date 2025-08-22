import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Breadcrumb, Layout, theme } from 'antd'
import { AppSidebar } from '~/components/AppSidebar'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.userId) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  // const { menus } = useAppContext()
  // const location = useLocation()
  // const breadcrumbs = useMemo(() => {
  //   return menus ? buildBreadcrumbs(menus, location.pathname) : []
  // }, [menus, location.pathname])

  // const BreadcrumbNav = () => (
  //   <div></div>
  //   // <Breadcrumb>
  //   //   <BreadcrumbList>
  //   //     {breadcrumbs.map((item, index, array) => (
  //   //       <div key={item.path} className="flex items-center gap-3">
  //   //         <BreadcrumbItem className={index < breadcrumbs.length - 1 ? 'hidden md:block' : ''}>
  //   //           {index < breadcrumbs.length - 1
  //   //             ? <BreadcrumbLink href={item.path}>{item.title}</BreadcrumbLink>
  //   //             : <BreadcrumbPage>{item.title}</BreadcrumbPage>}
  //   //         </BreadcrumbItem>
  //   //         {
  //   //           array.length - 1 > index
  //   //           && <BreadcrumbSeparator className="hidden md:block" />
  //   //         }
  //   //       </div>
  //   //     ))}
  //   //   </BreadcrumbList>
  //   // </Breadcrumb>
  // )

  return (
    <Layout className="h-vh">
      <AppSidebar />

      <Layout>
        <Layout.Header
          className="flex items-center px-6 b-l b-l-solid b-l-warmGray-200"
          style={{ background: colorBgContainer }}
        >
          <Breadcrumb items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]} />
        </Layout.Header>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
