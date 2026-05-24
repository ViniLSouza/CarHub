import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 180px)', md: 'calc(100vh - 220px)' },
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 760,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'rgba(20, 40, 80, 0.12)',
          background:
            'radial-gradient(circle at top right, rgba(53, 103, 181, 0.14), transparent 42%), #ffffff',
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              icon={<ErrorOutlineRoundedIcon />}
              label="Erro 404"
              sx={{ fontWeight: 700, bgcolor: 'rgba(26, 86, 219, 0.10)' }}
            />
            <Chip
              icon={<ConstructionRoundedIcon />}
              label="Em desenvolvimento"
              sx={{ fontWeight: 700, bgcolor: 'rgba(220, 38, 38, 0.08)' }}
            />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#13233e' }}>
            Página não encontrada
          </Typography>

          <Alert
            icon={<SupportAgentRoundedIcon fontSize="inherit" />}
            severity="info"
            sx={{
              borderRadius: 2,
              alignItems: 'center',
              '& .MuiAlert-message': { fontSize: { xs: '0.95rem', md: '1rem' } },
            }}
          >
            Página não encontrada ou ainda em desenvolvimento. Pedimos paciência e, em qualquer
            dúvida, entre em contato com o suporte carhub@gmail.com.
          </Alert>

          <Typography sx={{ color: '#3b4c68' }}>
            Se você chegou aqui por um link antigo, volte para a página inicial para continuar a
            navegação normalmente.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={Link}
              to="/home"
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#183a67',
                '&:hover': { bgcolor: '#102b4c' },
              }}
            >
              Voltar para Home
            </Button>

            <Button
              component="a"
              href="mailto:carhub@gmail.com"
              variant="outlined"
              startIcon={<SupportAgentRoundedIcon />}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Falar com o suporte
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
