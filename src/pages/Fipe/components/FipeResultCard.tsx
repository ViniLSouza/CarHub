import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import LocalGasStationRoundedIcon from '@mui/icons-material/LocalGasStationRounded'
import TagRoundedIcon from '@mui/icons-material/TagRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import type { PriceResult } from '../../../api/fipeApi'

type FipeResultCardProps = {
  priceData: PriceResult
  selectedBrandName: string
  selectedModelName: string
  yearId: string
}

function ResultField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'rgba(20,40,80,0.03)',
        border: '1px solid rgba(20,40,80,0.06)',
      }}
    >
      <Box sx={{ color: 'primary.main', mt: 0.1, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.15 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

export function FipeResultCard({
  priceData,
  selectedBrandName,
  selectedModelName,
  yearId,
}: FipeResultCardProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(22,163,74,0.2)',
        p: { xs: 2.5, md: 3.5 },
        background: 'linear-gradient(135deg, rgba(22,163,74,0.04) 0%, #fff 60%)',
      }}
    >
      <Stack spacing={2.5}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'rgba(22,163,74,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'success.main',
              }}
            >
              <CheckCircleRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Resultado da consulta
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Preço de referência encontrado
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<CheckCircleRoundedIcon />}
            label="Dados encontrados"
            sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontWeight: 600, border: '1px solid rgba(22,163,74,0.2)', '& .MuiChip-icon': { color: '#16a34a' } }}
          />
        </Box>

        {/* Price highlight */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1d4f91 0%, #0ea5e9 100%)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Preço FIPE
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.25 }}>
            {priceData.price ?? 'Não informado'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
            Referência: {priceData.referenceMonth ?? priceData.reference ?? 'Não informada'}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(20,40,80,0.08)' }} />

        {/* Details grid */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResultField
              icon={<DirectionsCarRoundedIcon fontSize="small" />}
              label="Marca"
              value={priceData.brand ?? selectedBrandName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResultField
              icon={<BuildRoundedIcon fontSize="small" />}
              label="Modelo"
              value={priceData.model ?? selectedModelName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResultField
              icon={<CalendarTodayRoundedIcon fontSize="small" />}
              label="Ano"
              value={String(priceData.modelYear ?? priceData.year ?? yearId)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResultField
              icon={<LocalGasStationRoundedIcon fontSize="small" />}
              label="Combustível"
              value={priceData.fuel ?? 'Não informado'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResultField
              icon={<TagRoundedIcon fontSize="small" />}
              label="Código FIPE"
              value={priceData.codeFipe ?? 'Não informado'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResultField
              icon={<EventNoteRoundedIcon fontSize="small" />}
              label="Referência"
              value={priceData.referenceMonth ?? priceData.reference ?? 'Não informada'}
            />
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  )
}
