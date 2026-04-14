import { useEffect, useState } from 'react'
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'
import {
  createSupplierProduct,
  deleteSupplierProduct,
  getSupplierCustomers,
  getSupplierProducts,
  updateSupplierProduct,
} from '@/api/supplierApi'

function SupplierDashboardPage() {
  const { authHeaders } = useAuth()
  const [products, setProducts] = useState([])
  const [buyers, setBuyers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  })
  const [editingId, setEditingId] = useState(null)

  async function loadProducts() {
    setProducts(await getSupplierProducts(authHeaders))
  }

  async function loadBuyers() {
    setBuyers(await getSupplierCustomers(authHeaders))
  }

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        await Promise.all([loadProducts(), loadBuyers()])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitProduct = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }

      if (editingId) {
        await updateSupplierProduct(authHeaders, editingId, payload)
      } else {
        await createSupplierProduct(authHeaders, payload)
      }

      setForm({ name: '', description: '', price: '', stock: '' })
      setEditingId(null)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Stack spacing={3}>
      <ErrorState message={error} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Product' : 'Create Product'}
        </Typography>
        <Stack component="form" spacing={2} onSubmit={submitProduct}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((v) => ({ ...v, description: e.target.value }))
            }
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}
          />
          <TextField
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm((v) => ({ ...v, stock: e.target.value }))}
          />
          <Button type="submit" variant="contained">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          My Products
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <LoadingState label="Loading products..." />
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState label="No products yet. Create your first one." />
                </TableCell>
              </TableRow>
            ) : null}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingId(product.id)
                      setForm({
                        name: product.name,
                        description: product.description || '',
                        price: product.price,
                        stock: product.stock,
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={async () => {
                      setError('')
                      try {
                        await deleteSupplierProduct(authHeaders, product.id)
                        await loadProducts()
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buyers
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <LoadingState label="Loading buyers..." />
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && buyers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState label="No purchases yet." />
                </TableCell>
              </TableRow>
            ) : null}
            {buyers.map((buyer, index) => (
              <TableRow key={`${buyer.customer_id}-${index}`}>
                <TableCell>{buyer.customer_name}</TableCell>
                <TableCell>{buyer.customer_email}</TableCell>
                <TableCell>{buyer.product_name}</TableCell>
                <TableCell>{buyer.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}

export default SupplierDashboardPage
