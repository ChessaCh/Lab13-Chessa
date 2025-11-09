import { useEffect, useState } from 'react'
import { fetchNilai, createNilai, updateNilai, deleteNilai } from '../services/api'
import { getAuth } from '../services/auth'
import { Link } from 'react-router-dom'

export default function NilaiManage() {
  const auth = getAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ student_identifier: '', course: '', score: '', note: '' })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNilai()
        setItems(data)
      } catch (e) {
        setError('Gagal memuat data nilai')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => {
    setForm({ student_identifier: '', course: '', score: '', note: '' })
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, score: parseFloat(form.score) }
      if (editId) {
        const updated = await updateNilai(editId, payload)
        setItems(items.map(i => (i.id === editId ? updated : i)))
      } else {
        const created = await createNilai(payload)
        setItems([created, ...items])
      }
      resetForm()
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menyimpan nilai')
    }
  }

  const startEdit = (item) => {
    setEditId(item.id)
    setForm({ student_identifier: item.student_email || '', course: item.course, score: item.score, note: item.note || '' })
  }

  const remove = async (id) => {
    try {
      await deleteNilai(id)
      setItems(items.filter(i => i.id !== id))
    } catch (err) {
      setError('Gagal menghapus nilai')
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, width: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/dashboard/dosen">← Kembali ke Dashboard Dosen</Link>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 24px rgba(0,0,0,0.08)', padding: 24 }}>
        <h2 style={{ margin: 0 }}>Kelola Nilai</h2>
        <p style={{ color: '#666' }}>Masuk sebagai: {auth?.email}</p>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div>
            <label>Email/NIM/ID Mahasiswa</label>
            <input name="student_identifier" value={form.student_identifier} onChange={onChange} placeholder="email atau NIM atau ID" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            <small style={{ color: '#666' }}>Bisa email (grace@student...), NIM/username, atau ID.</small>
          </div>
          <div>
            <label>Mata Kuliah</label>
            <input name="course" value={form.course} onChange={onChange} placeholder="Nama mata kuliah" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </div>
          <div>
            <label>Nilai (0-100)</label>
            <input name="score" type="number" min="0" max="100" step="0.1" value={form.score} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </div>
          <div>
            <label>Catatan</label>
            <input name="note" value={form.note} onChange={onChange} placeholder="Opsional" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff' }}>{editId ? 'Update Nilai' : 'Tambah Nilai'}</button>
            {editId && <button type="button" onClick={resetForm} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}>Batal Edit</button>}
          </div>
        </form>

        <div style={{ marginTop: 24 }}>
          {loading ? (
            <div>Memuat…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Mahasiswa</th>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Mata Kuliah</th>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Nilai</th>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Catatan</th>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.student_email || item.student}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.course}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.score}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.note || '-'}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                      <button onClick={() => startEdit(item)} style={{ marginRight: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>Edit</button>
                      <button onClick={() => remove(item.id)} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff' }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}