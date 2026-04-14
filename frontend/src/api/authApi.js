import { request } from './httpClient'

export function register({ name, email, password, role }) {
  return request('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  })
}

export function login({ email, password }) {
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export function logout(authHeaders) {
  return request('/api/logout', { method: 'POST', headers: authHeaders })
}
