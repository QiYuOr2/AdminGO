import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, Navigate, RouterProvider } from '@tanstack/react-router'
import { ConfigProvider } from 'antd'
import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { auth } from './common/auth'
import { AppProvider } from './contexts/AppContext'
import { routeTree } from './routeTree.gen'
import '@unocss/reset/normalize.css'
import './index.css'
import './i18n'
import 'virtual:uno.css'
import '@ant-design/v5-patch-for-react-19'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultNotFoundComponent: () => <Navigate to="/404" />,
})

function App() {
  useEffect(() => {
    auth.init()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ConfigProvider theme={{ cssVar: true }}>
          <RouterProvider router={router} context={{ auth }} />
        </ConfigProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
