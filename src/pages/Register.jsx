import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setOk(''); setBusy(true)
    try {
      await register(username, email, password)
      setOk('Registered. Please verify your email, then login.')
      setTimeout(()=> navigate('/login'), 1200)
    } catch (ex) {
      const d = ex?.response?.data
      const msg = Array.isArray(d) ? d.map(x => x.description || x.code).join(', ') : (typeof d === 'string' ? d : 'Registration failed')
      setErr(msg)
    } finally { setBusy(false) }
  }

  return (
    <div className="container py-4" style={{maxWidth: 520}}>
      <h3 className="mb-3">Register</h3>
      {ok && <small className="text-success d-block mb-2">{ok}</small>}
      {err && <small className="text-danger d-block mb-2">{err}</small>}
      <form onSubmit={submit} className="d-grid gap-2">
        <input className="form-control" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input className="form-control" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        <small className="text-muted">Have an account? <Link to="/login">Login</Link></small>
      </form>
    </div>
  )
}
