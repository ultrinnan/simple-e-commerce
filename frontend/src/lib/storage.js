const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function readSession() {
  const token = localStorage.getItem(TOKEN_KEY) || ''
  const userRaw = localStorage.getItem(USER_KEY)
  const user = userRaw ? JSON.parse(userRaw) : null
  return { token, user }
}

export function writeSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
