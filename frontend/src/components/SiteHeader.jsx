import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { SITE_HEADER_HEIGHT } from '@/constants/layout'

function SiteHeader({ cartItemsCount = 0, onOpenCart }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === ROUTES.home
  const isDashboard = location.pathname.includes('/dashboard')
  const isSupplierRoute = location.pathname.startsWith('/supplier')

  return (
    <AppBar
      position="static"
      color={isHome ? 'transparent' : isSupplierRoute ? 'primary' : 'default'}
      elevation={isHome ? 0 : 1}
      sx={
        isSupplierRoute
          ? {
              background: 'linear-gradient(90deg, #1f2a44 0%, #243b6b 100%)',
            }
          : undefined
      }
    >
      <Toolbar
        sx={{
          minHeight: SITE_HEADER_HEIGHT,
          gap: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          component={Link}
          to={ROUTES.home}
          variant="h6"
          sx={{
            color: isSupplierRoute ? '#fff' : 'inherit',
            fontWeight: 700,
            textDecoration: 'none',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Simple Shop
        </Typography>

        {isDashboard && user ? (
          <Stack sx={{ flexGrow: 1 }} spacing={0}>
            {isSupplierRoute ? (
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}
              >
                Supplier zone
              </Typography>
            ) : null}
            <Typography
              variant="body2"
              color={isSupplierRoute ? 'rgba(255,255,255,0.9)' : 'text.secondary'}
            >
              {user.role === 'supplier' ? 'Supplier' : 'Customer'} area
            </Typography>
          </Stack>
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}

        {isHome ? (
          user?.role === 'customer' ? (
            <IconButton
              color="inherit"
              aria-label="open cart"
              onClick={onOpenCart}
              sx={{
                color: isSupplierRoute ? '#fff' : 'inherit',
              }}
            >
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          ) : user?.role === 'supplier' ? (
            <Button
              component={Link}
              to={ROUTES.supplierDashboard}
              variant="contained"
            >
              Dashboard
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                to={ROUTES.customerLogin}
                variant="outlined"
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to={ROUTES.customerRegister}
                variant="contained"
              >
                Sign up
              </Button>
            </Stack>
          )
        ) : null}

        {isDashboard && user ? (
          <>
            {user.role === 'customer' ? (
              <IconButton
                color="inherit"
                aria-label="open cart"
                onClick={onOpenCart}
                sx={{
                  color: isSupplierRoute ? '#fff' : 'inherit',
                }}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            ) : null}
            <Typography
              variant="body2"
              noWrap
              sx={{ color: isSupplierRoute ? '#fff' : 'inherit' }}
            >
              {user.name}
            </Typography>
            <Button color="inherit" sx={{ color: isSupplierRoute ? '#fff' : 'inherit' }} onClick={logout}>
              Logout
            </Button>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}

export default SiteHeader
