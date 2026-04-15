import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { getCatalogProducts } from '@/api/catalogApi'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import {
  SITE_FOOTER_HEIGHT,
  SITE_HEADER_HEIGHT,
} from '@/constants/layout'
import { ROUTES } from '@/constants/routes'

function HomePage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        const data = await getCatalogProducts()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    run()
  }, [])

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${SITE_HEADER_HEIGHT}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        disableGutters
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Browse products from all suppliers.
        </Typography>

        <ErrorState message={error} />

        {isLoading ? <LoadingState label="Loading products..." /> : null}

        {!isLoading && products.length === 0 ? (
          <EmptyState label="No products available yet." />
        ) : null}

        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ minHeight: 44, mt: 0.5 }}
                  >
                    {product.description || 'No description'}
                  </Typography>
                  <Typography sx={{ mt: 1, fontWeight: 600 }}>
                    ${Number(product.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supplier: {product.supplier?.name || 'Unknown'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          height: `${SITE_FOOTER_HEIGHT}px`,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Supplier zone:{' '}
          <Link to={ROUTES.supplierLogin}>sign in</Link> /{' '}
          <Link to={ROUTES.supplierRegister}>sign up</Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default HomePage
