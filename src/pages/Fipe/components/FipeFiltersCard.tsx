import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Box, Paper, Stack, Typography } from '@mui/material'
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
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(20, 40, 80, 0.10)',
        p: { xs: 2, md: 3 },
        background: '#ffffff',
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TuneRoundedIcon sx={{ color: '#1d4f91' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#13233e' }}>
            Filtros da consulta
          </Typography>
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
