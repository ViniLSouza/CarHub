import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <Stack spacing={3}>
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
        <Stack spacing={2}>
          <Chip
            icon={<DirectionsCarFilledRoundedIcon />}
            label="Tabela FIPE"
            sx={{ width: 'fit-content', fontWeight: 600 }}
          />

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#13233e' }}>
            Consulte valores de veiculos com rapidez e clareza
          </Typography>

          <Typography sx={{ color: '#4a5b78', maxWidth: 760 }}>
            Escolha tipo, marca, modelo e ano para ver o preco atualizado da FIPE, com
            combustivel, codigo FIPE e mes de referencia em uma tela objetiva.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={Link}
              to="/fipe"
              variant="contained"
              size="large"
              startIcon={<SearchRoundedIcon />}
              sx={{
                width: { xs: '100%', sm: 'fit-content' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 999,
                px: 3,
                bgcolor: '#1d4f91',
                '&:hover': { bgcolor: '#153f75' },
              }}
            >
              Ir para consulta FIPE
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'rgba(20, 40, 80, 0.10)',
            p: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={1.25}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <SearchRoundedIcon sx={{ color: '#1d4f91' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#13233e' }}>
                Consulta guiada
              </Typography>
            </Box>
            <Typography sx={{ color: '#4a5b78' }}>
              Fluxo por etapas para reduzir erro: selecione marca, modelo e ano e veja o
              resultado final automaticamente.
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'rgba(20, 40, 80, 0.10)',
            p: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={1.25}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <SpeedRoundedIcon sx={{ color: '#1d4f91' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#13233e' }}>
                Resultado direto
              </Typography>
            </Box>
            <Typography sx={{ color: '#4a5b78' }}>
              Visual limpo e padronizado com os dados principais do veiculo para consulta
              rapida no dia a dia.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  )
}
