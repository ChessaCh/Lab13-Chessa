import { Navigate } from 'react-router-dom'
import { getAuth } from '../services/auth'

export default function ProtectedRoute({ children, role }) {
  const auth = getAuth()
  if (!auth?.access) {
    return <Navigate to="/login" replace />
  }
  if (role && auth?.role !== role) {
    // redirect to appropriate dashboard if wrong role
    const target = auth.role === 'student' ? '/dashboard/mahasiswa' : '/dashboard/dosen'
    return <Navigate to={target} replace />
  }
  return children
}