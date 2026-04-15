import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '@/utils/authErrorMessage'

function AuthPage({ title, role, mode, onSubmit }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  useEffect(() => {
    const msg = location.state?.infoMessage
    if (!msg) return
    // Flash message from router state (e.g. after redirect); then clear URL state.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time UI flash
    setInfoMessage(msg)
    navigate(`${location.pathname}${location.search || ''}`, {
      replace: true,
      state: {},
    })
  }, [location.pathname, location.search, location.state?.infoMessage, navigate])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await onSubmit(mode, role, form)
    } catch (err) {
      setError(getAuthErrorMessage(err, mode))
    }
  }

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {infoMessage ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {infoMessage}
        </Alert>
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Stack component="form" spacing={2} onSubmit={submit}>
        {mode === 'register' ? (
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
          />
        ) : null}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
          helperText={
            mode === 'register' ? 'At least 8 characters.' : undefined
          }
        />
        <Button type="submit" variant="contained">
          {mode === 'register' ? 'Create account' : 'Login'}
        </Button>
      </Stack>
    </Paper>
  )
}

export default AuthPage
