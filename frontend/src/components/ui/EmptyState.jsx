import { Typography } from '@mui/material'

function EmptyState({ label = 'No data yet.' }) {
  return (
    <Typography color="text.secondary" sx={{ py: 2 }}>
      {label}
    </Typography>
  )
}

export default EmptyState
