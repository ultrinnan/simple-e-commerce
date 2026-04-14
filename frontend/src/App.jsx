import './App.css'
import { useEffect, useMemo, useState } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  })
  const [isRegister, setIsRegister] = useState(false)
  const [products, setProducts] = useState([])
  const [supplierProducts, setSupplierProducts] = useState([])
  const [buyers, setBuyers] = useState([])
  const [cart, setCart] = useState({ items: [] })
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('')
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  })
  const [editingId, setEditingId] = useState(null)
  const apiBase = '/api'

  const authHeaders = useMemo(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token],
  )

  async function loadProducts() {
    const res = await fetch(`${apiBase}/products`)
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
  }

  async function loadMe() {
    const res = await fetch(`${apiBase}/me`, { headers: authHeaders })
    if (!res.ok) {
      doLogout()
      return
    }
    const data = await res.json()
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  async function loadSupplierProducts() {
    const res = await fetch(`${apiBase}/supplier/products`, {
      headers: authHeaders,
    })
    const data = await res.json()
    setSupplierProducts(Array.isArray(data) ? data : [])
  }

  async function loadBuyers() {
    const res = await fetch(`${apiBase}/supplier/customers`, {
      headers: authHeaders,
    })
    const data = await res.json()
    setBuyers(Array.isArray(data) ? data : [])
  }

  async function loadCart() {
    const res = await fetch(`${apiBase}/cart`, { headers: authHeaders })
    const data = await res.json()
    setCart(data?.items ? data : { items: [] })
  }

  async function loadOrders() {
    const res = await fetch(`${apiBase}/orders`, { headers: authHeaders })
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    const endpoint = isRegister ? 'register' : 'login'
    const payload = isRegister
      ? authForm
      : { email: authForm.email, password: authForm.password }

    const res = await fetch(`${apiBase}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok) {
      setMessage(data.message || 'Authentication failed')
      return
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setMessage('Logged in successfully')
  }

  async function doLogout() {
    if (token) {
      await fetch(`${apiBase}/logout`, {
        method: 'POST',
        headers: authHeaders,
      })
    }

    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCart({ items: [] })
    setOrders([])
    setSupplierProducts([])
    setBuyers([])
  }

  const submitProduct = async (event) => {
    event.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const endpoint = editingId
      ? `${apiBase}/supplier/products/${editingId}`
      : `${apiBase}/supplier/products`

    const res = await fetch(endpoint, {
      method,
      headers: authHeaders,
      body: JSON.stringify({
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setMessage(data.message || 'Could not save product')
      return
    }

    setProductForm({ name: '', description: '', price: '', stock: '' })
    setEditingId(null)
    setMessage('Product saved')
    await loadSupplierProducts()
    await loadProducts()
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
    })
  }

  const deleteProduct = async (id) => {
    const res = await fetch(`${apiBase}/supplier/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })

    if (!res.ok) return
    await loadSupplierProducts()
    await loadProducts()
  }

  const addToCart = async (productId) => {
    const res = await fetch(`${apiBase}/cart/items`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.message || 'Could not add to cart')
      return
    }
    await loadCart()
  }

  const updateCartItem = async (itemId, quantity) => {
    const res = await fetch(`${apiBase}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ quantity }),
    })
    if (!res.ok) return
    await loadCart()
  }

  const removeCartItem = async (itemId) => {
    const res = await fetch(`${apiBase}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    if (!res.ok) return
    await loadCart()
  }

  const checkout = async () => {
    const res = await fetch(`${apiBase}/checkout`, {
      method: 'POST',
      headers: authHeaders,
    })
    const data = await res.json()

    if (!res.ok) {
      setMessage(data.message || 'Checkout failed')
      return
    }

    setMessage(`Order #${data.id} created`)
    await loadCart()
    await loadOrders()
    await loadBuyers()
  }

  const cartTotal = (cart.items || []).reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
    0,
  )

  useEffect(() => {
    const run = async () => {
      await loadProducts()
    }
    run()
  }, [])

  useEffect(() => {
    if (!token) return
    const run = async () => {
      await loadMe()
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    if (!user) return
    const run = async () => {
      if (user.role === 'supplier') {
        await loadSupplierProducts()
        await loadBuyers()
        return
      }
      await loadCart()
      await loadOrders()
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <main className="container">
      <header className="header">
        <h1>Simple Multi-Supplier E-Commerce</h1>
        <p>Supplier + customer MVP for interview case</p>
        {user ? (
          <div className="row">
            <span>
              Logged in as {user.name} ({user.role})
            </span>
            <button onClick={doLogout}>Logout</button>
          </div>
        ) : null}
      </header>

      {message ? <p className="message">{message}</p> : null}

      {!user ? (
        <section className="card">
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <form onSubmit={handleAuthSubmit} className="form">
            {isRegister ? (
              <input
                placeholder="Name"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm((v) => ({ ...v, name: e.target.value }))
                }
              />
            ) : null}
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm((v) => ({ ...v, email: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm((v) => ({ ...v, password: e.target.value }))
              }
            />
            {isRegister ? (
              <select
                value={authForm.role}
                onChange={(e) =>
                  setAuthForm((v) => ({ ...v, role: e.target.value }))
                }
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
              </select>
            ) : null}
            <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
          </form>
          <button className="linkish" onClick={() => setIsRegister((v) => !v)}>
            {isRegister ? 'Use login instead' : 'Need an account? Register'}
          </button>
        </section>
      ) : null}

      <section className="card">
        <h2>All Products</h2>
        <ul className="list">
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - ${Number(product.price).toFixed(2)} - Stock:{' '}
              {product.stock} - Supplier: {product.supplier?.name}
              {user?.role === 'customer' ? (
                <button onClick={() => addToCart(product.id)}>Add to cart</button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {user?.role === 'supplier' ? (
        <>
          <section className="card">
            <h2>{editingId ? 'Edit Product' : 'Create Product'}</h2>
            <form onSubmit={submitProduct} className="form">
              <input
                placeholder="Name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((v) => ({ ...v, name: e.target.value }))
                }
              />
              <input
                placeholder="Description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((v) => ({ ...v, description: e.target.value }))
                }
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((v) => ({ ...v, price: e.target.value }))
                }
              />
              <input
                type="number"
                placeholder="Stock"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm((v) => ({ ...v, stock: e.target.value }))
                }
              />
              <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            </form>
          </section>

          <section className="card">
            <h2>My Products</h2>
            <ul className="list">
              {supplierProducts.map((product) => (
                <li key={product.id}>
                  <strong>{product.name}</strong> - ${Number(product.price).toFixed(2)} - Stock:{' '}
                  {product.stock}
                  <button onClick={() => startEdit(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>My Buyers</h2>
            <ul className="list">
              {buyers.map((buyer, index) => (
                <li key={`${buyer.customer_id}-${index}`}>
                  {buyer.customer_name} ({buyer.customer_email}) bought {buyer.quantity} x{' '}
                  {buyer.product_name} at ${Number(buyer.price).toFixed(2)}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      {user?.role === 'customer' ? (
        <>
          <section className="card">
            <h2>Cart</h2>
            <ul className="list">
              {(cart.items || []).map((item) => (
                <li key={item.id}>
                  {item.product?.name} - Qty: {item.quantity}
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateCartItem(item.id, item.quantity - 1)
                        : removeCartItem(item.id)
                    }
                  >
                    -
                  </button>
                  <button onClick={() => removeCartItem(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
            <p>Total: ${cartTotal.toFixed(2)}</p>
            <button onClick={checkout}>Checkout</button>
          </section>

          <section className="card">
            <h2>Order History</h2>
            <ul className="list">
              {orders.map((order) => (
                <li key={order.id}>
                  <strong>Order #{order.id}</strong> - ${Number(order.total_amount).toFixed(2)}
                  <ul>
                    {(order.items || []).map((item) => (
                      <li key={item.id}>
                        {item.quantity} x {item.product_name} @ $
                        {Number(item.price).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </main>
  )
}

export default App
