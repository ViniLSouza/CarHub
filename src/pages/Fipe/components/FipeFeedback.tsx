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
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#4a5b78' }}>
          <CircularProgress size={20} />
          <Typography>Carregando dados...</Typography>
        </Box>
      )}

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </>
  )
}
