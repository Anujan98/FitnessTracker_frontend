import { useEffect, useState } from 'react'
import * as api from '../services/exercises.js'
import * as workoutsApi from '../services/workouts.js'

export default function Exercises() {
  const [items, setItems] = useState([])
  const [workouts, setWorkouts] = useState([])

  const [name, setName] = useState('')
  const [reps, setReps] = useState('')
  const [sets, setSets] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [workoutId, setWorkoutId] = useState('') 

  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    try { setItems(await api.list()) }
    catch (e) { setErr(e?.response?.data || 'Failed to load') }
  }
  const loadWorkouts = async () => {
    try { setWorkouts(await workoutsApi.list()) } catch {}
  }
  useEffect(() => { load(); loadWorkouts() }, [])

  const reset = () => {
    setName(''); setReps(''); setSets(''); setCaloriesBurned(''); setWorkoutId(''); setEditingId(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')

    const wid = parseInt(workoutId, 10) || 0
    const repsNum = Number(reps)
    const setsNum = Number(sets)
    const calNum  = Number(caloriesBurned)

    if (!name.trim()) { setErr('Name is required'); return }
    if (!wid)         { setErr('Please select a workout'); return }
    if (!Number.isFinite(repsNum) || repsNum <= 0) { setErr('Reps must be a positive number'); return }
    if (!Number.isFinite(setsNum) || setsNum <= 0) { setErr('Sets must be a positive number'); return }
    if (!Number.isFinite(calNum)  || calNum  < 0)  { setErr('Calories must be 0 or more'); return }

    const payload = {
      name: name.trim(),
      reps: repsNum,
      sets: setsNum,
      caloriesBurned: calNum,
      workoutId: wid, 
    }

    try {
      if (editingId) await api.update(editingId, payload)
      else await api.create(payload)
      reset(); await load()
    } catch (e2) {
      setErr(e2?.response?.data || 'Save failed')
    }
  }

  const startEdit = (it) => {
    setEditingId(it.exerciseId ?? it.id)
    setName(it.name || '')
    setReps(String(it.reps ?? ''))
    setSets(String(it.sets ?? ''))
    setCaloriesBurned(String(it.caloriesBurned ?? ''))
    setWorkoutId(String(it.workoutId ?? '')) 
  }

  const delItem = async (id) => {
    if (!confirm('Delete?')) return
    try { await api.remove(id); await load() }
    catch (e) { setErr(e?.response?.data || 'Delete failed') }
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Exercises</h3>
      {err && <small className="text-danger d-block mb-2">{err}</small>}

      <form onSubmit={submit} className="mb-3 d-grid gap-2">
        <input className="form-control" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="form-control" type="number" placeholder="Reps" value={reps} onChange={e=>setReps(e.target.value)} required />
        <input className="form-control" type="number" placeholder="Sets" value={sets} onChange={e=>setSets(e.target.value)} required />
        <input className="form-control" type="number" placeholder="Calories Burned" value={caloriesBurned} onChange={e=>setCaloriesBurned(e.target.value)} required />

        <select
          className="form-select"
          value={workoutId}
          onChange={e => setWorkoutId(e.target.value)} 
          required
        >
          <option value="">Select Workout</option>
          {workouts.map(w => {
            const id = w.workoutId ?? w.id
            return <option key={id} value={String(id)}>{w.title}</option>
          })}
        </select>

        <div className="d-flex gap-2">
          <button className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <table className="table table-sm align-middle">
        <thead><tr><th>ID</th><th>Name</th><th>Reps</th><th>Sets</th><th>Calories</th><th>Workout</th><th style={{width:120}}></th></tr></thead>
        <tbody>
          {items.map(it => {
            const id = it.exerciseId ?? it.id
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{it.name}</td>
                <td>{it.reps}</td>
                <td>{it.sets}</td>
                <td>{it.caloriesBurned}</td>
                <td>{it.workoutId}</td>
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
