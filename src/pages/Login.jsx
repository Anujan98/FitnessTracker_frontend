import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const from = (useLocation().state?.from?.pathname) || '/dashboard'

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (ex) {
      setErr(ex?.response?.data || 'Login failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="container py-4" style={{maxWidth: 520}}>
      <h3 className="mb-3">Login</h3>
      {err && <small className="text-danger d-block mb-2">{err}</small>}
      <form onSubmit={submit} className="d-grid gap-2">
        <input className="form-control" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
        <small className="text-muted">No account? <Link to="/register">Register</Link></small>
      </form>
    </div>
  )
}
