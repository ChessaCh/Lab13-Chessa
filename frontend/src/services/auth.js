import { setAuthHeader } from './api'
const KEY = 'auth'

export function saveAuth(data) {
  const { token, email, username, full_name, major, role } = data
  const auth = {
    access: token?.access,
    refresh: token?.refresh,
    email,
    username,
    full_name,
    major,
    role
  }
  localStorage.setItem(KEY, JSON.stringify(auth))
  setAuthHeader(auth.access)
  return auth
}

export function getAuth() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    setAuthHeader(parsed?.access)
    return parsed
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY)
  setAuthHeader(null)
}