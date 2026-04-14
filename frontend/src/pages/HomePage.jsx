import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function HomePage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" gutterBottom>
          Multi-Supplier E-Commerce
        </Typography>
        <Typography color="text.secondary">
          Choose your environment to continue.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Supplier Environment
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button component={Link} to={ROUTES.supplierLogin} variant="contained">
                Login
              </Button>
              <Button component={Link} to={ROUTES.supplierRegister} variant="outlined">
                Register
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Environment
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button component={Link} to={ROUTES.customerLogin} variant="contained">
                Login
              </Button>
              <Button component={Link} to={ROUTES.customerRegister} variant="outlined">
                Register
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default HomePage
