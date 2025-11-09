import { useNavigate } from 'react-router-dom'
import { getAuth, clearAuth } from '../services/auth'

export default function DashboardStudent() {
  const auth = getAuth()
  const navigate = useNavigate()

  function logout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div style={card}>
      <h1 style={title}>Dashboard Mahasiswa</h1>
      <p style={{ fontSize: 18 }}>Selamat Datang, {auth?.full_name}</p>
      <div style={panel}>
        <p><b>Email:</b> {auth?.email}</p>
        <p><b>Username (NIM):</b> {auth?.username}</p>
        <p><b>Role:</b> student</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <a href="/dashboard/mahasiswa/nilai" style={linkBtn}>Lihat Nilai</a>
        <button style={logoutBtn} onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

const card = { width: 700, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }
const title = { fontSize: 34, fontWeight: 800, marginBottom: 12 }
const panel = { background: '#f1f5f9', padding: 16, borderRadius: 10, margin: '12px 0' }
const logoutBtn = { background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }
const linkBtn = { background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 8, padding: '10px 16px', textDecoration: 'none' }