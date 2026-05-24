import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Chip, Paper, Stack, Typography } from '@mui/material'

export function FipeHeader() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(20, 40, 80, 0.10)',
        p: { xs: 2, md: 3 },
        background:
          'linear-gradient(135deg, rgba(28, 93, 193, 0.10) 0%, rgba(255, 255, 255, 1) 52%)',
      }}
    >
      <Stack spacing={1.5}>
        <Chip
          icon={<SearchRoundedIcon />}
          label="Consulta FIPE"
          sx={{ width: 'fit-content', fontWeight: 600 }}
        />

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#13233e' }}>
          Consulte valores de veiculos com rapidez e clareza
        </Typography>

        <Typography sx={{ color: '#4a5b78', maxWidth: 760 }}>
          Selecione tipo, marca, modelo e ano para buscar a referencia de preco atualizada.
        </Typography>
      </Stack>
    </Paper>
  )
}
