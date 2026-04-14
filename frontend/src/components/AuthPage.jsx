import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'

function AuthPage({ title, role, mode, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await onSubmit(mode, role, form)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Paper sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
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
        />
        <Button type="submit" variant="contained">
          {mode === 'register' ? 'Create account' : 'Login'}
        </Button>
      </Stack>
    </Paper>
  )
}

export default AuthPage
