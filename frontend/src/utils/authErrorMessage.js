/**
 * Maps API/network errors to user-friendly messages for auth flows.
 */
export function getAuthErrorMessage(error, mode = 'login') {
  const status = error?.status
  const data = error?.data ?? {}

  // Network / offline
  if (error?.name === 'TypeError' && String(error?.message).includes('fetch')) {
    return 'Network error. Check your connection and try again.'
  }

  if (status === 401) {
    return 'Incorrect email or password. Please try again.'
  }

  if (status === 403) {
    return "You don't have permission to perform this action."
  }

  if (status === 422) {
    // Laravel validation: { message, errors: { field: ["..."] } }
    if (data.errors && typeof data.errors === 'object') {
      const firstField = Object.keys(data.errors)[0]
      const firstMsg = data.errors[firstField]?.[0]
      if (firstMsg) {
        return humanizeValidationMessage(firstField, firstMsg)
      }
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      return humanizeBackendMessage(data.message)
    }
    return mode === 'register'
      ? 'Please check the form and try again.'
      : 'Could not sign you in. Please check your details.'
  }

  if (status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  if (status >= 500) {
    return 'Something went wrong on our side. Please try again later.'
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return humanizeBackendMessage(error.message)
  }

  return 'Something went wrong. Please try again.'
}

function humanizeBackendMessage(message) {
  const m = message.toLowerCase()
  if (m.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (m.includes('authentication failed')) {
    return 'Could not sign you in. Please check your email and password.'
  }
  return message
}

function humanizeValidationMessage(field, msg) {
  const lower = msg.toLowerCase()
  if (lower.includes('has already been taken') || lower.includes('unique')) {
    return 'This email is already registered. Try signing in or use another email.'
  }
  if (lower.includes('password') && lower.includes('8')) {
    return 'Password must be at least 8 characters.'
  }
  if (field === 'email' && lower.includes('valid')) {
    return 'Please enter a valid email address.'
  }
  return msg
}
