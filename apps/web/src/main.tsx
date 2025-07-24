import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, Navigate, RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { auth } from './common/auth'
import { AppProvider } from './contexts/AppContext'
import { routeTree } from './routeTree.gen'
import './index.css'
import './i18n'

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
        <RouterProvider router={router} context={{ auth }} />
      </AppProvider>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
