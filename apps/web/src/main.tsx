import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { auth } from './common/auth'
import { routeTree } from './routeTree.gen'
import './index.css'
import './i18n'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

function App() {
  useEffect(() => {
    auth.init()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
