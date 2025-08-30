import { useState } from 'react'

const InitialPage = 1
const InitialSize = 10

interface Pagination {
  page: number
  size: number
  total: number
}

interface UsePaginationOptions {
  defaultValues?: Partial<Pagination>
}

export function usePagination(options?: UsePaginationOptions) {
  const { defaultValues } = options || {}
  const [page, _setPage] = useState(defaultValues?.page || InitialPage)
  const [size, _setSize] = useState(defaultValues?.size || InitialSize)

  return {
    pagination: {
      page,
      size,
    },
  }
}
