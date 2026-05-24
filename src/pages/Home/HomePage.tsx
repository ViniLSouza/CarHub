import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PriceCheckRoundedIcon from '@mui/icons-material/PriceCheckRounded'
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { GradientHeroCard } from '../../components/GradientHeroCard'

const features = [
  {
    icon: <SearchRoundedIcon />,
    title: 'Consulta guiada',
    description:
      'Fluxo por etapas com busca em cascata: tipo, marca, modelo e ano para obter o valor de referência com menos fricção.',
    color: '#1d4f91',
    bg: 'rgba(29,79,145,0.07)',
  },
  {
    icon: <Inventory2RoundedIcon />,
    title: 'Estoque organizado',
    description:
      'Cadastro de veículos com modal dedicado, listagem limpa e tela de detalhes para editar ou excluir quando necessário.',
    color: '#0284c7',
    bg: 'rgba(2,132,199,0.07)',
  },
  {
    icon: <LayersRoundedIcon />,
    title: 'Estrutura modular',
    description:
      'Componentes reutilizáveis, utilitários compartilhados e APIs centralizadas deixam o projeto mais fácil de evoluir.',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.07)',
  },
]

export function HomePage() {
  return (
    <Stack spacing={3}>
      {/* Hero */}
      <GradientHeroCard
        sx={{ p: { xs: 3, md: 4 }, background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2f50 50%, #1d4f91 100%)' }}
        stackSpacing={2.5}
        contentMaxWidth={700}
        chip={
          <Chip
            icon={<DirectionsCarFilledRoundedIcon />}
            label="CarHub Platform"
            sx={{
              width: 'fit-content',
              fontWeight: 700,
              bgcolor: 'rgba(56,189,248,0.18)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.3)',
              '& .MuiChip-icon': { color: '#38bdf8' },
            }}
          />
        }
        title={
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Consulta FIPE e controle{' '}
            <Box component="span" sx={{ color: '#38bdf8' }}>
              de estoque
            </Box>{' '}
            em um só lugar
          </Typography>
        }
        description={
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Consulte preços de referência na tabela FIPE e gerencie os veículos cadastrados
            em um fluxo simples, rápido e padronizado.
          </Typography>
        }
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            component={Link}
            to="/fipe"
            variant="contained"
            size="large"
            startIcon={<PriceCheckRoundedIcon />}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              width: { xs: '100%', sm: 'fit-content' },
              bgcolor: '#38bdf8',
              color: '#0d1b2a',
              fontWeight: 700,
              '&:hover': { bgcolor: '#0ea5e9', boxShadow: '0 4px 16px rgba(56,189,248,0.45)' },
            }}
          >
            Consultar FIPE
          </Button>

          <Button
            component={Link}
            to="/estoque"
            variant="outlined"
            size="large"
            startIcon={<Inventory2RoundedIcon />}
            sx={{
              width: { xs: '100%', sm: 'fit-content' },
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.35)',
              fontWeight: 700,
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Ver estoque
          </Button>
        </Stack>
      </GradientHeroCard>

      {/* Feature cards */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
          Funcionalidades
        </Typography>
        <Grid container spacing={2}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid rgba(20,40,80,0.10)',
                  p: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: feature.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick links */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            component={Link}
            to="/fipe"
            sx={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: 2,
              border: '1px solid rgba(29,79,145,0.15)',
              p: 2.5,
              background: 'linear-gradient(135deg, rgba(29,79,145,0.06) 0%, #fff 100%)',
              transition: 'all 0.2s',
              '&:hover': { boxShadow: '0 4px 20px rgba(29,79,145,0.15)', transform: 'translateY(-2px)' },
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }} spacing={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: 'rgba(29,79,145,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', flexShrink: 0 }}>
                <SearchRoundedIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Consulta FIPE
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Busque preços por tipo, marca, modelo e ano
                </Typography>
              </Box>
              <ArrowForwardRoundedIcon sx={{ ml: 'auto', color: 'primary.main', flexShrink: 0 }} />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            component={Link}
            to="/estoque"
            sx={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: 2,
              border: '1px solid rgba(2,132,199,0.15)',
              p: 2.5,
              background: 'linear-gradient(135deg, rgba(2,132,199,0.06) 0%, #fff 100%)',
              transition: 'all 0.2s',
              '&:hover': { boxShadow: '0 4px 20px rgba(2,132,199,0.15)', transform: 'translateY(-2px)' },
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }} spacing={2}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: 'rgba(2,132,199,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                <Inventory2RoundedIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Estoque de veículos
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Cadastre, edite e acompanhe seu inventário
                </Typography>
              </Box>
              <ArrowForwardRoundedIcon sx={{ ml: 'auto', color: '#0284c7', flexShrink: 0 }} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Stats bar */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid rgba(20,40,80,0.08)',
          p: { xs: 2, md: 2.5 },
          background: '#fff',
        }}
      >
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
          {[
            { icon: <SpeedRoundedIcon />, label: 'API FIPE', desc: 'Dados atualizados' },
            { icon: <SearchRoundedIcon />, label: 'Consulta gratuita', desc: 'Sem cadastro' },
            { icon: <Inventory2RoundedIcon />, label: 'Gestão de estoque', desc: 'CRUD completo' },
          ].map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
              <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{stat.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{stat.desc}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  )
}
