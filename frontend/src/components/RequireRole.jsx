import { Navigate } from 'react-router-dom'
import { dashboardByRole, loginByRole } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

function RequireRole({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to={loginByRole(role)} replace />
  if (user.role !== role) return <Navigate to={dashboardByRole(user.role)} replace />
  return children
}

export default RequireRole
