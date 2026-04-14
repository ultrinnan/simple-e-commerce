import { CircularProgress, Stack, Typography } from '@mui/material'

function LoadingState({ label = 'Loading...' }) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ py: 4 }}>
      <CircularProgress size={28} />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  )
}

export default LoadingState
