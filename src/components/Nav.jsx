import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Nav() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="navbar-brand" to="/">FitnessTracker</Link>
        <div className="d-flex gap-2">
          <NavLink className="btn btn-link" to="/">Home</NavLink>
          {token && (
            <>
              <NavLink className="btn btn-link" to="/workouts">Workouts</NavLink>
              <NavLink className="btn btn-link" to="/meals">Meals</NavLink>
              <NavLink className="btn btn-link" to="/goals">Goals</NavLink>
              <NavLink className="btn btn-link" to="/exercises">Exercises</NavLink>
              <NavLink className="btn btn-link" to="/progress">Progress</NavLink>
            </>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          {!token ? (
            <>
              <NavLink className="btn btn-link" to="/login">Login</NavLink>
              <NavLink className="btn btn-primary" to="/register">Register</NavLink>
            </>
          ) : (
            <>
              <small className="text-muted">Hi{user?.username ? `, ${user.username}` : ''}</small>
              <button className="btn btn-outline-danger btn-sm"
                onClick={() => { logout(); navigate('/login') }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
