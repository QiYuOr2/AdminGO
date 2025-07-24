import { AUTH_TOKEN_KEY, AUTH_USER_ID_KEY, AUTH_USERNAME_KEY } from './constants'

export class HttpError extends Error {
  status: number
  info: any

  constructor(message: string, status: number, info: any) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.info = info
  }
}

interface ApiClientOptions extends RequestInit {
  data?: object | FormData
  params?: Record<string, any>
}

export interface ApiClientResponse<T> {
  code: number
  data: T
  message: string
}

const BASE_URL = import.meta.env.VITE_API_BASIC_URL

export async function apiClient<T = any>(endpoint: string, options: ApiClientOptions = {}): Promise<ApiClientResponse<T>> {
  const { data, params, headers: customHeaders, ...customConfig } = options

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    ...customConfig,
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...customHeaders,
  })

  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (data) {
    if (data instanceof FormData) {
      config.body = data
    }
    else {
      headers.set('Content-Type', 'application/json')
      config.body = JSON.stringify(data)
    }
  }

  config.headers = headers

  const url = new URL(`${BASE_URL || `${location.origin}/api`}${endpoint}`)
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  }

  const response = await fetch(url.toString(), config)

  if (!response.ok) {
    let errorInfo
    try {
      errorInfo = await response.json()
    }
    catch {
      errorInfo = { message: response.statusText }
    }
    throw new HttpError(
      errorInfo.message || 'An error occurred during the request.',
      response.status,
      errorInfo,
    )
  }

  const result = await response.json()

  if (result.code === 10001) {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_ID_KEY)
    localStorage.removeItem(AUTH_USERNAME_KEY)
  }

  return result
}
