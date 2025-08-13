import { AUTH_USER_ID_KEY, AUTH_USERNAME_KEY } from './constants'

export interface Auth {
  login: (username: string, userId: number) => void
  logout: () => void
  init: () => void
  status: 'loggedOut' | 'loggedIn'
  username?: string
  userId?: number
}

export const auth: Auth = {
  status: 'loggedOut',
  username: undefined,
  userId: undefined,
  login: (username: string, userId: number) => {
    auth.status = 'loggedIn'
    auth.username = username
    auth.userId = userId
  },
  logout: () => {
    auth.status = 'loggedOut'
    auth.username = undefined
  },
  init: () => {
    if (!localStorage.getItem(AUTH_USERNAME_KEY)) {
      return
    }
    auth.status = 'loggedIn'
    auth.userId = Number(localStorage.getItem(AUTH_USER_ID_KEY))
    auth.username = localStorage.getItem(AUTH_USERNAME_KEY) || undefined
  },
}
