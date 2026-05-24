import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'

type FipeFeedbackProps = {
  isLoadingAny: boolean
  errorMessage: string
}

export function FipeFeedback({ isLoadingAny, errorMessage }: FipeFeedbackProps) {
  if (!isLoadingAny && !errorMessage) {
    return null
  }

  return (
    <>
      {isLoadingAny && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            bgcolor: 'rgba(29,79,145,0.06)',
            border: '1px solid rgba(29,79,145,0.14)',
            borderRadius: 3,
            px: 2,
            py: 1.25,
          }}
        >
          <CircularProgress size={18} sx={{ color: 'primary.main' }} />
          <HourglassTopRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
            Buscando dados na tabela FIPE...
          </Typography>
        </Box>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {errorMessage}
        </Alert>
      )}
    </>
  )
}
