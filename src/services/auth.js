import api from './api'
const base = '/api/Auth'

export async function register({ username, email, password }) {
  const { data } = await api.post(`${base}/register`, { username, email, password })
  return data
}
export async function login({ username, password }) {
  const { data } = await api.post(`${base}/login`, { username, password })
  return data   // { token }
}
