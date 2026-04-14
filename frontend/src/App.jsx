import { Suspense, lazy, useState } from 'react'
import { Alert, Container, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import LoadingState from '@/components/ui/LoadingState'
import AuthPage from '@/components/AuthPage'
import DashboardHeader from '@/components/DashboardHeader'
import RequireRole from '@/components/RequireRole'
import { ROUTES, dashboardByRole, loginByRole } from '@/constants/routes'
import AuthProvider from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'

const HomePage = lazy(() => import('@/pages/HomePage'))
const SupplierDashboardPage = lazy(() => import('@/pages/SupplierDashboardPage'))
const CustomerDashboardPage = lazy(() => import('@/pages/CustomerDashboardPage'))

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

function AppShell() {
  const { authRequest } = useAuth()
  const [message, setMessage] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const handleAuth = async (mode, role, formData) => {
    const result = await authRequest(mode, role, formData)
    if (result.shouldLogin) {
      setMessage('Logged in successfully')
      navigate(dashboardByRole(result.userRole))
      return
    }
    setMessage('Registered successfully, please login')
    navigate(loginByRole(role))
  }

  return (
    <>
      {location.pathname.includes('/dashboard') ? (
        <DashboardHeader />
      ) : null}

      <Container sx={{ py: 4 }}>
        {message ? <Alert sx={{ mb: 2 }}>{message}</Alert> : null}
        <Suspense fallback={<LoadingState label="Loading page..." />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route
              path={ROUTES.supplierLogin}
              element={
                <AuthPage
                  title="Supplier Login"
                  role="supplier"
                  mode="login"
                  onSubmit={handleAuth}
                />
              }
            />
            <Route
              path={ROUTES.supplierRegister}
              element={
                <AuthPage
                  title="Supplier Registration"
                  role="supplier"
                  mode="register"
                  onSubmit={handleAuth}
                />
              }
            />
            <Route
              path={ROUTES.customerLogin}
              element={
                <AuthPage
                  title="Customer Login"
                  role="customer"
                  mode="login"
                  onSubmit={handleAuth}
                />
              }
            />
            <Route
              path={ROUTES.customerRegister}
              element={
                <AuthPage
                  title="Customer Registration"
                  role="customer"
                  mode="register"
                  onSubmit={handleAuth}
                />
              }
            />
            <Route
              path={ROUTES.supplierDashboard}
              element={
                <RequireRole role="supplier">
                  <SupplierDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path={ROUTES.customerDashboard}
              element={
                <RequireRole role="customer">
                  <CustomerDashboardPage />
                </RequireRole>
              }
            />
          </Routes>
        </Suspense>
      </Container>
    </>
  )
}

export default App
