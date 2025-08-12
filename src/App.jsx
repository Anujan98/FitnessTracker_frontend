import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workouts from './pages/Workouts.jsx'
import Meals from './pages/Meals.jsx'
import Goals from './pages/Goals.jsx'
import Exercises from './pages/Exercises.jsx'
import Progress from './pages/Progress.jsx'

function Private({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
        <Route path="/workouts" element={<Private><Workouts /></Private>} />
        <Route path="/meals" element={<Private><Meals /></Private>} />
        <Route path="/goals" element={<Private><Goals /></Private>} />
        <Route path="/exercises" element={<Private><Exercises /></Private>} />
        <Route path="/progress" element={<Private><Progress /></Private>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
