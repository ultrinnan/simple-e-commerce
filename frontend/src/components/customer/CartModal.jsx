import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingState from '@/components/ui/LoadingState'

function CartModal({
  open,
  onClose,
  cart,
  isLoading,
  error,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}) {
  const items = cart?.items || []
  const total = items.reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
    0,
  )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Cart</DialogTitle>
      <DialogContent>
        <ErrorState message={error} />
        {isLoading ? <LoadingState label="Loading cart..." /> : null}
        {!isLoading && items.length === 0 ? (
          <EmptyState label="Your cart is empty." />
        ) : null}
        <Stack spacing={1.5}>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1.5,
              }}
            >
              <Box>
                <Typography fontWeight={600}>{item.product?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${Number(item.product?.price || 0).toFixed(2)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" onClick={() => onDecrement(item)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 24, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <IconButton size="small" onClick={() => onIncrement(item)}>
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onRemove(item)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Typography sx={{ mr: 'auto', fontWeight: 600 }}>
          Total: ${total.toFixed(2)}
        </Typography>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onCheckout} disabled={!items.length}>
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CartModal
