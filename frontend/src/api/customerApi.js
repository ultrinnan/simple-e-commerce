import { request } from './httpClient'

export function getCart(authHeaders) {
  return request('/api/cart', { headers: authHeaders })
}

export function addCartItem(authHeaders, productId, quantity = 1) {
  return request('/api/cart/items', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ product_id: productId, quantity }),
  })
}

export function updateCartItem(authHeaders, itemId, quantity) {
  return request(`/api/cart/items/${itemId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ quantity }),
  })
}

export function deleteCartItem(authHeaders, itemId) {
  return request(`/api/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: authHeaders,
  })
}

export function checkout(authHeaders) {
  return request('/api/checkout', {
    method: 'POST',
    headers: authHeaders,
  })
}

export function getOrders(authHeaders) {
  return request('/api/orders', { headers: authHeaders })
}
