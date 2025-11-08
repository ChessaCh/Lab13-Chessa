import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { saveAuth } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await login({ email, password })
      const auth = saveAuth(data)
      const dest = auth.role === 'student' ? '/dashboard/mahasiswa' : '/dashboard/dosen'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login gagal. Periksa email/password.')
    }
  }

  return (
    <div style={card}>
      <h1 style={title}>Login Universitas</h1>
      <form onSubmit={handleSubmit}>
        <label style={label}>Email:</label>
        <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label style={label}>Password:</label>
        <input style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div style={errorBox}>{error}</div>}
        <button style={button} type="submit">Login</button>
      </form>
      <p style={{ marginTop: 16 }}>Belum punya akun? <Link to="/register">Registrasi di sini</Link></p>
    </div>
  )
}

const card = { width: '100%', maxWidth: 560, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }
const title = { fontSize: 32, fontWeight: 700, marginBottom: 20, textAlign: 'center' }
const label = { display: 'block', marginBottom: 6, fontWeight: 600 }
const input = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', marginBottom: 14, borderRadius: 8, border: '1px solid #cfd8dc', background: '#e7effc' }
const button = { width: '100%', padding: '12px 14px', border: 'none', borderRadius: 8, background: '#1e64ff', color: 'white', fontWeight: 700, cursor: 'pointer' }
const errorBox = { background: '#ffe5e5', color: '#b00020', padding: 10, borderRadius: 8, marginBottom: 12 }