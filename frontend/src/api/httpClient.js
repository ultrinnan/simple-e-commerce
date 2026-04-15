export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function withApiBase(path) {
  if (!API_BASE_URL || /^https?:\/\//.test(path)) {
    return path
  }

  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`
  }

  return `${API_BASE_URL}/${path}`
}

export async function request(path, options = {}) {
  const response = await fetch(withApiBase(path), options)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : {}

  if (!response.ok) {
    const message =
      typeof data.message === 'string' && data.message.trim()
        ? data.message
        : 'Request failed'
    throw new ApiError(message, { status: response.status, data })
  }

  return data
}
