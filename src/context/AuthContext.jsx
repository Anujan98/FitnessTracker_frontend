import { createContext, useContext, useState } from 'react'
import * as auth from '../services/auth.js'

const Ctx = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser]   = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  const register = (username, email, password) =>
    auth.register({ username, email, password })

  const login = async (username, password) => {
    const { token } = await auth.login({ username, password })
    setToken(token); localStorage.setItem('token', token)
    const u = { username }
    setUser(u); localStorage.setItem('user', JSON.stringify(u))
  }

  const logout = () => {
    setToken(''); setUser(null)
    localStorage.removeItem('token'); localStorage.removeItem('user')
  }

  return <Ctx.Provider value={{ token, user, register, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth(){ return useContext(Ctx) }
