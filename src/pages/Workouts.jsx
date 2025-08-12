import { useEffect, useState } from 'react'
import * as api from '../services/workouts.js'

export default function Workouts() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [durationInMinutes, setDuration] = useState('')
  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    try { setItems(await api.list()) } catch (e) { setErr(e?.response?.data || 'Failed to load') }
  }
  useEffect(() => { load() }, [])
  const reset = () => { setTitle(''); setDate(''); setDuration(''); setEditingId(null) }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    const payload = { title, date: new Date(date + 'T00:00:00').toISOString(), durationInMinutes: Number(durationInMinutes) }
    try {
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      reset(); await load()
    } catch (e) { setErr(e?.response?.data || 'Save failed') }
  }

  const startEdit = (it) => {
    setEditingId(it.workoutId ?? it.id)
    setTitle(it.title || '')
    setDate((it.date || '').slice(0,10))
    setDuration(it.durationInMinutes ?? '')
  }

  const delItem = async (id) => {
    if (!confirm('Delete?')) return
    try { await api.remove(id); await load() } catch (e) { setErr(e?.response?.data || 'Delete failed') }
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Workouts</h3>
      {err && <small className="text-danger d-block mb-2">{err}</small>}

      <form onSubmit={submit} className="mb-3 d-grid gap-2">
        <input className="form-control" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="form-control" type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <input className="form-control" type="number" placeholder="Minutes" value={durationInMinutes} onChange={e=>setDuration(e.target.value)} required />
        <div className="d-flex gap-2">
          <button className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <table className="table table-sm align-middle">
        <thead><tr><th>ID</th><th>Title</th><th>Date</th><th>Min</th><th style={{width:120}}></th></tr></thead>
        <tbody>
          {items.map(it => {
            const id = it.workoutId ?? it.id
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{it.title}</td>
                <td>{(it.date||'').slice(0,10)}</td>
                <td>{it.durationInMinutes}</td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={()=>startEdit(it)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>delItem(id)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
