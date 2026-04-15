import { request } from './httpClient'

export function register({ name, email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase()
  return request('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email: normalizedEmail, password, role }),
  })
}

export function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, password }),
  })
}

export function logout(authHeaders) {
  return request('/api/logout', { method: 'POST', headers: authHeaders })
}
