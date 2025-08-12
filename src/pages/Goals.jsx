import { useEffect, useState } from 'react'
import * as api from '../services/goals.js'

export default function Goals() {
  const [items, setItems] = useState([])
  const [type, setType] = useState('')
  const [target, setTarget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    try { setItems(await api.list()) } catch (e) { setErr(e?.response?.data || 'Failed to load') }
  }
  useEffect(() => { load() }, [])
  const reset = () => { setType(''); setTarget(''); setStartDate(''); setEndDate(''); setEditingId(null) }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    const payload = {
      type,
      target: Number(target),
      startDate: new Date(startDate + 'T00:00:00').toISOString(),
      endDate: new Date(endDate + 'T00:00:00').toISOString(),
    }
    try {
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      reset(); await load()
    } catch (e) { setErr(e?.response?.data || 'Save failed') }
  }

  const startEdit = (it) => {
    setEditingId(it.goalId ?? it.id)
    setType(it.type || '')
    setTarget(it.target ?? '')
    setStartDate((it.startDate || '').slice(0,10))
    setEndDate((it.endDate || '').slice(0,10))
  }

  const delItem = async (id) => {
    if (!confirm('Delete?')) return
    try { await api.remove(id); await load() } catch (e) { setErr(e?.response?.data || 'Delete failed') }
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Goals</h3>
      {err && <small className="text-danger d-block mb-2">{err}</small>}

      <form onSubmit={submit} className="mb-3 d-grid gap-2">
        <input className="form-control" placeholder="Type" value={type} onChange={e=>setType(e.target.value)} required />
        <input className="form-control" type="number" placeholder="Target" value={target} onChange={e=>setTarget(e.target.value)} required />
        <input className="form-control" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
        <input className="form-control" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
        <div className="d-flex gap-2">
          <button className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <table className="table table-sm align-middle">
        <thead><tr><th>ID</th><th>Type</th><th>Target</th><th>Start</th><th>End</th><th style={{width:120}}></th></tr></thead>
        <tbody>
          {items.map(it => {
            const id = it.goalId ?? it.id
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{it.type}</td>
                <td>{it.target}</td>
                <td>{(it.startDate||'').slice(0,10)}</td>
                <td>{(it.endDate||'').slice(0,10)}</td>
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
