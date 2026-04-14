import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {user?.role === 'supplier' ? 'Supplier Environment' : 'Customer Environment'}
        </Typography>
        {user ? (
          <>
            <Typography>{user.name}</Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}

export default DashboardHeader
