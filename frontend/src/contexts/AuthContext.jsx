import { useMemo, useState } from 'react'
import { login, logout as logoutRequest, register } from '../api/authApi'
import { clearSession, readSession, writeSession } from '../lib/storage'
import { AuthContext } from './authContextObject'

function AuthProvider({ children }) {
  const initialSession = readSession()
  const [token, setToken] = useState(initialSession.token)
  const [user, setUser] = useState(initialSession.user)

  const authHeaders = useMemo(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token],
  )

  const saveSession = (authData) => {
    setToken(authData.token)
    setUser(authData.user)
    writeSession(authData.token, authData.user)
  }

  const logout = async () => {
    if (token) {
      try {
        await logoutRequest(authHeaders)
      } catch {
        // ignore logout errors and clear local session anyway
      }
    }
    setToken('')
    setUser(null)
    clearSession()
  }

  const authRequest = async (mode, role, formData) => {
    if (mode === 'register') {
      await register({ ...formData, role })
      return { shouldLogin: false, userRole: role }
    }

    const authData = await login(formData)
    if (authData.user.role !== role) {
      throw new Error(`This account belongs to ${authData.user.role}`)
    }
    saveSession(authData)
    return { shouldLogin: true, userRole: authData.user.role }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authHeaders,
        authRequest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
