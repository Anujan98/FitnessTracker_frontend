import api from './api'
const base = '/api/Goal'
export const list   = async () => (await api.get(base)).data
export const create = async (payload) => (await api.post(base, payload)).data
export const remove = async (id) => (await api.delete(`${base}/${id}`)).data
export const update = async (id, payload) =>  (await api.put(`${base}/${id}`, payload)).data