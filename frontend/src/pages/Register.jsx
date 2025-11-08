import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

const majors = [
  { value: 'artificial_intelligence_and_robotics', label: 'AIR' },
  { value: 'business_mathematics', label: 'BM' },
  { value: 'digital_business_technology', label: 'DBT' },
  { value: 'product_design_engineering', label: 'PDE' },
  { value: 'energy_business_technology', label: 'EBT' },
  { value: 'food_business_technology', label: 'FBT' },
]

export default function Register() {
  const [form, setForm] = useState({ email: '', full_name: '', major: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await register(form)
      setSuccess('Registrasi berhasil. Silakan login.')
      setTimeout(() => navigate('/login', { replace: true }), 800)
    } catch (err) {
      const data = err.response?.data
      const msg = typeof data === 'string' ? data : (Object.values(data || {})[0]?.[0] || 'Registrasi gagal')
      setError(msg)
    }
  }

  return (
    <div style={card}>
      <h1 style={title}>Registrasi Akun</h1>
      <form onSubmit={handleSubmit}>
        <label style={label}>Email:</label>
        <input style={input} type="email" value={form.email} onChange={e=>update('email', e.target.value)} required />
        <small style={{ color:'#666' }}>(Format: nim@student.prasetiyamulya.ac.id atau nama@prasetiyamulya.ac.id)</small>

        <label style={label}>Nama Panjang:</label>
        <input style={input} value={form.full_name} onChange={e=>update('full_name', e.target.value)} required />

        <label style={label}>Jurusan/Fakultas:</label>
        <select style={input} value={form.major} onChange={e=>update('major', e.target.value)} required>
          <option value="" disabled>Pilih jurusan</option>
          {majors.map(m=> (<option key={m.value} value={m.value}>{m.label}</option>))}
        </select>

        <label style={label}>Password:</label>
        <input style={input} type="password" value={form.password} onChange={e=>update('password', e.target.value)} required />

        <label style={label}>Konfirmasi Password:</label>
        <input style={input} type="password" value={form.password_confirmation} onChange={e=>update('password_confirmation', e.target.value)} required />

        {error && <div style={errorBox}>{error}</div>}
        {success && <div style={successBox}>{success}</div>}
        <button style={button} type="submit">Register</button>
      </form>
      <p style={{ marginTop: 16 }}>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
    </div>
  )
}

const card = { width: '100%', maxWidth: 560, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }
const title = { fontSize: 32, fontWeight: 700, marginBottom: 20, textAlign: 'center' }
const label = { display: 'block', marginBottom: 6, fontWeight: 600 }
const input = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', marginBottom: 14, borderRadius: 8, border: '1px solid #cfd8dc', background: '#fff' }
const button = { width: '100%', padding: '12px 14px', border: 'none', borderRadius: 8, background: '#1e64ff', color: 'white', fontWeight: 700, cursor: 'pointer' }
const errorBox = { background: '#ffe5e5', color: '#b00020', padding: 10, borderRadius: 8, marginBottom: 12 }
const successBox = { background: '#e6ffed', color: '#0b8f37', padding: 10, borderRadius: 8, marginBottom: 12 }