import { useEffect, useState } from 'react'
import * as api from '../services/meals.js'

export default function Meals() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [date, setDate] = useState('')
  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    try { setItems(await api.list()) } catch (e) { setErr(e?.response?.data || 'Failed to load') }
  }
  useEffect(() => { load() }, [])
  const reset = () => { setName(''); setCalories(''); setDate(''); setEditingId(null) }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    const payload = { name, calories: Number(calories), date: new Date(date + 'T00:00:00').toISOString() }
    try {
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      reset(); await load()
    } catch (e) { setErr(e?.response?.data || 'Save failed') }
  }

  const startEdit = (it) => {
    setEditingId(it.mealId ?? it.id)
    setName(it.name || '')
    setCalories(it.calories ?? '')
    setDate((it.date || '').slice(0,10))
  }

  const delItem = async (id) => {
    if (!confirm('Delete?')) return
    try { await api.remove(id); await load() } catch (e) { setErr(e?.response?.data || 'Delete failed') }
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Meals</h3>
      {err && <small className="text-danger d-block mb-2">{err}</small>}

      <form onSubmit={submit} className="mb-3 d-grid gap-2">
        <input className="form-control" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="form-control" type="number" placeholder="Calories" value={calories} onChange={e=>setCalories(e.target.value)} required />
        <input className="form-control" type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <div className="d-flex gap-2">
          <button className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <table className="table table-sm align-middle">
        <thead><tr><th>ID</th><th>Name</th><th>Calories</th><th>Date</th><th style={{width:120}}></th></tr></thead>
        <tbody>
          {items.map(it => {
            const id = it.mealId ?? it.id
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{it.name}</td>
                <td>{it.calories}</td>
                <td>{(it.date||'').slice(0,10)}</td>
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
