import { useEffect, useState } from 'react'
import { fetchNilai } from '../services/api'
import { Link } from 'react-router-dom'

export default function NilaiStudent() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNilai()
        setItems(data)
      } catch (e) {
        setError('Gagal memuat nilai')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ padding: 24, maxWidth: 900, width: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/dashboard/mahasiswa">← Kembali ke Dashboard Mahasiswa</Link>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 24px rgba(0,0,0,0.08)', padding: 24 }}>
        <h2 style={{ margin: 0 }}>Nilai Saya</h2>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div style={{ marginTop: 16 }}>
          {loading ? (
            <div>Memuat…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Mata Kuliah</th>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Nilai</th>
                  <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.course}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.score}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{item.note || '-'}</td>
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