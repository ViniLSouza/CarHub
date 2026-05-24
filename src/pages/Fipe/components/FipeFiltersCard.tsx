import { FormControl, InputLabel, MenuItem, Paper, Select, Stack } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ReactNode } from 'react'
import { getOptionId, getOptionName, type ApiOption, type VehicleType } from '../../../api/fipeApi'
import { vehicleTypeOptions } from '../constants'

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
  onVehicleTypeChange: (event: SelectChangeEvent<VehicleType>) => void
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
      }}
    >
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="vehicle-type-label">Tipo</InputLabel>
          <Select
            labelId="vehicle-type-label"
            label="Tipo"
            value={vehicleType}
            onChange={onVehicleTypeChange}
          >
            {vehicleTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!brands.length || loadingBrands}>
          <InputLabel id="brand-label">Marca</InputLabel>
          <Select
            labelId="brand-label"
            label="Marca"
            value={brandId}
            onChange={(event) => onBrandChange(event.target.value)}
          >
            {brands.map((brand) => (
              <MenuItem key={getOptionId(brand)} value={getOptionId(brand)}>
                {getOptionName(brand)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={loadingModels || !brandId || !models.length}>
          <InputLabel id="model-label">Modelo</InputLabel>
          <Select
            labelId="model-label"
            label="Modelo"
            value={modelId}
            onChange={(event) => onModelChange(event.target.value)}
          >
            {models.map((model) => (
              <MenuItem key={getOptionId(model)} value={getOptionId(model)}>
                {getOptionName(model)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!modelId || loadingYears || !years.length}>
          <InputLabel id="year-label">Ano</InputLabel>
          <Select
            labelId="year-label"
            label="Ano"
            value={yearId}
            onChange={(event) => onYearChange(event.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={getOptionId(year)} value={getOptionId(year)}>
                {getOptionName(year)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {children}
      </Stack>
    </Paper>
  )
}
