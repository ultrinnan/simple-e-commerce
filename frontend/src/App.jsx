import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Box, Container, CssBaseline } from '@mui/material'
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
import CartModal from '@/components/customer/CartModal'
import SiteHeader from '@/components/SiteHeader'
import RequireRole from '@/components/RequireRole'
import { ROUTES, dashboardByRole, loginByRole } from '@/constants/routes'
import AuthProvider from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import {
  checkout,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '@/api/customerApi'

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
  const { authHeaders, authRequest, user } = useAuth()
  const [message, setMessage] = useState('')
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [cart, setCart] = useState({ items: [] })
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState('')
  const [customerRefreshKey, setCustomerRefreshKey] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const isHomeRoute = location.pathname === ROUTES.home
  const cartItemsCount = useMemo(
    () => (cart.items || []).reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  )

  const refreshCart = useCallback(async () => {
    if (user?.role !== 'customer') return
    setCartLoading(true)
    setCartError('')
    try {
      const data = await getCart(authHeaders)
      setCart(data?.items ? data : { items: [] })
    } catch (err) {
      setCartError(err.message)
    } finally {
      setCartLoading(false)
    }
  }, [authHeaders, user?.role])

  useEffect(() => {
    if (user?.role === 'customer') {
      refreshCart()
      return
    }
    setCart({ items: [] })
  }, [user, refreshCart])

  const handleAuth = async (mode, role, formData) => {
    const result = await authRequest(mode, role, formData)
    if (result.wrongRoleRedirect) {
      const target = loginByRole(result.actualRole)
      const infoMessage =
        result.actualRole === 'supplier'
          ? "Looks like you're signing in with a supplier account. Use supplier sign-in below."
          : "Looks like you're signing in with a customer account. Use customer sign-in below."
      navigate(target, { state: { infoMessage } })
      return
    }
    if (result.shouldLogin) {
      setMessage(
        result.mode === 'register'
          ? 'Account created and logged in successfully'
          : 'Logged in successfully',
      )
      navigate(dashboardByRole(result.userRole))
      return
    }
    setMessage('Registered successfully, please login')
    navigate(loginByRole(role))
  }

  return (
    <>
      <SiteHeader
        cartItemsCount={cartItemsCount}
        onOpenCart={() => {
          if (user?.role === 'customer') setCartModalOpen(true)
        }}
      />

      <Box sx={isHomeRoute ? { p: 0, m: 0 } : {}}>
        {isHomeRoute ? (
          <Suspense fallback={<LoadingState label="Loading page..." />}>
            <Routes>
              <Route path={ROUTES.home} element={<HomePage />} />
            </Routes>
          </Suspense>
        ) : (
          <Container sx={{ py: 4 }}>
            {message ? <Alert sx={{ mb: 2 }}>{message}</Alert> : null}
            <Suspense fallback={<LoadingState label="Loading page..." />}>
              <Routes>
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
                      <CustomerDashboardPage
                        onCartChanged={refreshCart}
                        refreshKey={customerRefreshKey}
                      />
                    </RequireRole>
                  }
                />
              </Routes>
            </Suspense>
          </Container>
        )}
      </Box>

      <CartModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cart={cart}
        isLoading={cartLoading}
        error={cartError}
        onIncrement={async (item) => {
          setCartError('')
          try {
            await updateCartItem(authHeaders, item.id, item.quantity + 1)
            await refreshCart()
          } catch (err) {
            setCartError(err.message)
          }
        }}
        onDecrement={async (item) => {
          setCartError('')
          try {
            if (item.quantity > 1) {
              await updateCartItem(authHeaders, item.id, item.quantity - 1)
            } else {
              await deleteCartItem(authHeaders, item.id)
            }
            await refreshCart()
          } catch (err) {
            setCartError(err.message)
          }
        }}
        onRemove={async (item) => {
          setCartError('')
          try {
            await deleteCartItem(authHeaders, item.id)
            await refreshCart()
          } catch (err) {
            setCartError(err.message)
          }
        }}
        onCheckout={async () => {
          setCartError('')
          try {
            await checkout(authHeaders)
            await refreshCart()
            setCartModalOpen(false)
            setCustomerRefreshKey((v) => v + 1)
            if (location.pathname !== ROUTES.customerDashboard) {
              navigate(ROUTES.customerDashboard)
            }
          } catch (err) {
            setCartError(err.message)
          }
        }}
      />
    </>
  )
}

export default App
