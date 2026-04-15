import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { getCatalogProducts } from '@/api/catalogApi'
import {
  addCartItem,
  getOrders,
} from '@/api/customerApi'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'

function CustomerDashboardPage({ onCartChanged, refreshKey = 0 }) {
  const { authHeaders } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [cartSnackbar, setCartSnackbar] = useState({
    open: false,
    message: '',
  })

  async function loadProducts() {
    setProducts(await getCatalogProducts())
  }

  async function loadOrders() {
    setOrders(await getOrders(authHeaders))
  }

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        await Promise.all([loadProducts(), loadOrders()])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  return (
    <Stack spacing={3}>
      <Snackbar
        open={cartSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setCartSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCartSnackbar((s) => ({ ...s, open: false }))}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {cartSnackbar.message}
        </Alert>
      </Snackbar>

      <ErrorState message={error} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Catalog
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <LoadingState label="Loading catalog..." />
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState label="No products available." />
                </TableCell>
              </TableRow>
            ) : null}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.supplier?.name}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={async () => {
                      setError('')
                      try {
                        await addCartItem(authHeaders, product.id)
                        await onCartChanged?.()
                        setCartSnackbar({
                          open: true,
                          message: `Added “${product.name}” to cart`,
                        })
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    Add to cart
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Items</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <LoadingState label="Loading orders..." />
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <EmptyState label="No orders yet." />
                </TableCell>
              </TableRow>
            ) : null}
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  {(order.items || [])
                    .map((item) => `${item.quantity}x ${item.product_name}`)
                    .join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}

export default CustomerDashboardPage
