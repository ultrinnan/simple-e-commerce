import { request } from './httpClient'

export function getCatalogProducts() {
  return request('/api/products')
}
