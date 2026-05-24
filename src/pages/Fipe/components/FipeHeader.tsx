import { Box, Typography } from '@mui/material'

export function FipeHeader() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#13233e', mb: 0.5 }}>
        Consulta FIPE
      </Typography>
      <Typography sx={{ color: '#4a5b78' }}>
        Selecione os dados do veiculo para buscar a referencia de preco.
      </Typography>
    </Box>
  )
}
