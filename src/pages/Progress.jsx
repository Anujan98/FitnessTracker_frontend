import { useEffect, useState } from 'react'
import * as api from '../services/progress.js'

export default function Progress() {
  const [items, setItems] = useState([])
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    try { setItems(await api.list()) } catch (e) { setErr(e?.response?.data || 'Failed to load') }
  }
  useEffect(() => { load() }, [])
  const reset = () => { setWeight(''); setDate(''); setNote(''); setEditingId(null) }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    const payload = { weight: Number(weight), date: new Date(date + 'T00:00:00').toISOString(), note }
    try {
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      reset(); await load()
    } catch (e) { setErr(e?.response?.data || 'Save failed') }
  }

  const startEdit = (it) => {
    setEditingId(it.progressId ?? it.id)
    setWeight(it.weight ?? '')
    setDate((it.date || '').slice(0,10))
    setNote(it.note || '')
  }

  const delItem = async (id) => {
    if (!confirm('Delete?')) return
    try { await api.remove(id); await load() } catch (e) { setErr(e?.response?.data || 'Delete failed') }
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Progress</h3>
      {err && <small className="text-danger d-block mb-2">{err}</small>}

      <form onSubmit={submit} className="mb-3 d-grid gap-2">
        <input className="form-control" type="number" placeholder="Weight (kg)" value={weight} onChange={e=>setWeight(e.target.value)} required />
        <input className="form-control" type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <input className="form-control" placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} />
        <div className="d-flex gap-2">
          <button className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <table className="table table-sm align-middle">
        <thead><tr><th>ID</th><th>Weight</th><th>Date</th><th>Note</th><th style={{width:120}}></th></tr></thead>
        <tbody>
          {items.map(it => {
            const id = it.progressId ?? it.id
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{it.weight}</td>
                <td>{(it.date||'').slice(0,10)}</td>
                <td>{it.note}</td>
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
