import { request } from './httpClient'

export function getSupplierProducts(authHeaders) {
  return request('/api/supplier/products', { headers: authHeaders })
}

export function createSupplierProduct(authHeaders, payload) {
  return request('/api/supplier/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(payload),
  })
}

export function updateSupplierProduct(authHeaders, productId, payload) {
  return request(`/api/supplier/products/${productId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify(payload),
  })
}

export function deleteSupplierProduct(authHeaders, productId) {
  return request(`/api/supplier/products/${productId}`, {
    method: 'DELETE',
    headers: authHeaders,
  })
}

export function getSupplierCustomers(authHeaders) {
  return request('/api/supplier/customers', { headers: authHeaders })
}
