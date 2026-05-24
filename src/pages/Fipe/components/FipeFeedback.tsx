import { Alert, Box, CircularProgress, Typography } from '@mui/material'

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
            gap: 1,
            alignItems: 'center',
            color: '#4a5b78',
            bgcolor: 'rgba(29, 79, 145, 0.06)',
            borderRadius: 2,
            px: 1.5,
            py: 1,
          }}
        >
          <CircularProgress size={20} />
          <Typography>Carregando dados...</Typography>
        </Box>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </>
  )
}
