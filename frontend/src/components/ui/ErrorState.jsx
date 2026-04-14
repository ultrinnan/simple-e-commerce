import { Alert } from '@mui/material'

function ErrorState({ message }) {
  if (!message) return null
  return <Alert severity="error">{message}</Alert>
}

export default ErrorState
