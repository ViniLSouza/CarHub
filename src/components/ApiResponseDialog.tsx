import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useEffect } from 'react'

type ApiResponseDialogProps = {
  open: boolean
  title: string
  message: string
  severity: 'success' | 'error'
  onClose: () => void
}

export function ApiResponseDialog({
  open,
  title,
  message,
  severity,
  onClose,
}: ApiResponseDialogProps) {
  const isSuccess = severity === 'success'

  useEffect(() => {
    if (!open) {
      return
    }

    const timerId = window.setTimeout(onClose, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [open, onClose])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="api-response-title">
      <DialogTitle id="api-response-title" sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: isSuccess ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            {isSuccess ? (
              <CheckCircleRoundedIcon sx={{ fontSize: 36, color: 'success.main' }} />
            ) : (
              <ErrorRoundedIcon sx={{ fontSize: 36, color: 'error.main' }} />
            )}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 0, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          color={isSuccess ? 'success' : 'error'}
          sx={{ fontWeight: 700, minWidth: 120 }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}