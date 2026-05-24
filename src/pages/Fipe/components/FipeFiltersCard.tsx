import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { ApiOption, VehicleType } from '../../../api/fipeApi'
import { FipeSelectors } from '../../../components/FipeSelectors'

type FipeFiltersCardProps = {
  vehicleType: VehicleType
  brandId: string
  modelId: string
  yearId: string
  brands: ApiOption[]
  models: ApiOption[]
  years: ApiOption[]
  loadingBrands: boolean
  loadingModels: boolean
  loadingYears: boolean
  onVehicleTypeChange: (value: VehicleType) => void
  onBrandChange: (value: string) => void
  onModelChange: (value: string) => void
  onYearChange: (value: string) => void
  children?: ReactNode
}

export function FipeFiltersCard({
  vehicleType,
  brandId,
  modelId,
  yearId,
  brands,
  models,
  years,
  loadingBrands,
  loadingModels,
  loadingYears,
  onVehicleTypeChange,
  onBrandChange,
  onModelChange,
  onYearChange,
  children,
}: FipeFiltersCardProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(20,40,80,0.08)',
        p: { xs: 2.5, md: 3.5 },
        background: '#ffffff',
      }}
    >
      <Stack spacing={2.5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'rgba(29,79,145,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
              }}
            >
              <TuneRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Filtros da consulta
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Preencha todos os campos para ver o resultado
              </Typography>
            </Box>
          </Box>
          <Chip
            label="Consulta gratuita"
            size="small"
            sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontWeight: 600, border: '1px solid rgba(22,163,74,0.2)' }}
          />
        </Box>

        <FipeSelectors
          idPrefix="fipe"
          vehicleType={vehicleType}
          brandId={brandId}
          modelId={modelId}
          yearId={yearId}
          brands={brands}
          models={models}
          years={years}
          loadingBrands={loadingBrands}
          loadingModels={loadingModels}
          loadingYears={loadingYears}
          onVehicleTypeChange={onVehicleTypeChange}
          onBrandChange={onBrandChange}
          onModelChange={onModelChange}
          onYearChange={onYearChange}
        />

        {children}
      </Stack>
    </Paper>
  )
}
