import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { PriceResult } from '../../../api/fipeApi'

type FipeResultCardProps = {
  priceData: PriceResult
  selectedBrandName: string
  selectedModelName: string
  yearId: string
}

export function FipeResultCard({
  priceData,
  selectedBrandName,
  selectedModelName,
  yearId,
}: FipeResultCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(20, 40, 80, 0.10)',
        p: { xs: 2, md: 3 },
        background:
          'linear-gradient(135deg, rgba(28, 93, 193, 0.08) 0%, rgba(255, 255, 255, 1) 45%)',
      }}
    >
      <Stack spacing={1.25}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SearchRoundedIcon sx={{ color: '#1d4f91' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#13233e' }}>
            Resultado da consulta
          </Typography>
        </Box>
        <Typography sx={{ color: '#1f2f4a' }}>
          <strong>Marca:</strong> {priceData.brand ?? selectedBrandName}
        </Typography>
        <Typography sx={{ color: '#1f2f4a' }}>
          <strong>Modelo:</strong> {priceData.model ?? selectedModelName}
        </Typography>
        <Typography sx={{ color: '#1f2f4a' }}>
          <strong>Ano:</strong> {priceData.modelYear ?? priceData.year ?? yearId}
        </Typography>
        <Typography sx={{ color: '#1f2f4a' }}>
          <strong>Combustivel:</strong> {priceData.fuel ?? 'Nao informado'}
        </Typography>
        <Typography sx={{ color: '#1f2f4a' }}>
          <strong>Codigo FIPE:</strong> {priceData.codeFipe ?? 'Nao informado'}
        </Typography>
        <Typography sx={{ fontWeight: 700, color: '#0f3464' }}>
          <strong>Preco FIPE:</strong> {priceData.price ?? 'Nao informado'}
        </Typography>
        <Typography sx={{ color: '#4a5b78' }}>
          <strong>Referencia:</strong> {priceData.referenceMonth ?? priceData.reference ?? 'Nao informada'}
        </Typography>
      </Stack>
    </Paper>
  )
}
