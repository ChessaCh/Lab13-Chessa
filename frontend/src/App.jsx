import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardStudent from './pages/DashboardStudent'
import DashboardLecturer from './pages/DashboardLecturer'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/mahasiswa"
          element={<ProtectedRoute role="student"><DashboardStudent /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/dosen"
          element={<ProtectedRoute role="instructor"><DashboardLecturer /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}