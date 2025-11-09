import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api/auth/'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

export function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function login({ email, password }) {
  const res = await api.post('login/', { email, password })
  return res.data
}

export async function register(payload) {
  const res = await api.post('register/', payload)
  return res.data
}

// Nilai (Grades) endpoints
export async function fetchNilai() {
  const res = await api.get('nilai/')
  return res.data
}

export async function createNilai(payload) {
  const res = await api.post('nilai/', payload)
  return res.data
}

export async function updateNilai(id, payload) {
  const res = await api.put(`nilai/${id}/`, payload)
  return res.data
}

export async function deleteNilai(id) {
  const res = await api.delete(`nilai/${id}/`)
  return res.data
}