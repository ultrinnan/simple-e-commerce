import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Paper,
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
  checkout,
  deleteCartItem,
  getCart,
  getOrders,
  updateCartItem,
} from '@/api/customerApi'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'

function CustomerDashboardPage() {
  const { authHeaders } = useAuth()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [] })
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadProducts() {
    setProducts(await getCatalogProducts())
  }

  async function loadCart() {
    setCart(await getCart(authHeaders))
  }

  async function loadOrders() {
    setOrders(await getOrders(authHeaders))
  }

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        await Promise.all([loadProducts(), loadCart(), loadOrders()])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cartTotal = (cart.items || []).reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
    0,
  )

  return (
    <Stack spacing={3}>
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
                        await loadCart()
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
          Cart
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <LoadingState label="Loading cart..." />
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && (cart.items || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState label="Your cart is empty." />
                </TableCell>
              </TableRow>
            ) : null}
            {(cart.items || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${Number(item.product?.price || 0).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={async () => {
                      setError('')
                      try {
                        await updateCartItem(authHeaders, item.id, item.quantity + 1)
                        await loadCart()
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    +
                  </Button>
                  <Button
                    size="small"
                    onClick={async () => {
                      setError('')
                      try {
                        if (item.quantity > 1) {
                          await updateCartItem(authHeaders, item.id, item.quantity - 1)
                        } else {
                          await deleteCartItem(authHeaders, item.id)
                        }
                        await loadCart()
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    -
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Total: ${cartTotal.toFixed(2)}</Typography>
          <Button
            variant="contained"
            onClick={async () => {
              setError('')
              try {
                await checkout(authHeaders)
                await loadCart()
                await loadOrders()
              } catch (err) {
                setError(err.message)
              }
            }}
          >
            Checkout
          </Button>
        </Box>
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
