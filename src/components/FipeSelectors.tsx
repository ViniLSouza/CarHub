import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { getOptionId, getOptionName, type ApiOption, type VehicleType } from '../api/fipeApi'
import { vehicleTypeOptions } from '../shared/constants/vehicle'

type FipeSelectorsProps = {
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
  idPrefix?: string
}

export function FipeSelectors({
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
  idPrefix = 'fipe',
}: FipeSelectorsProps) {
  const vehicleTypeLabelId = `${idPrefix}-vehicle-type-label`
  const brandLabelId = `${idPrefix}-brand-label`
  const modelLabelId = `${idPrefix}-model-label`
  const yearLabelId = `${idPrefix}-year-label`

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel id={vehicleTypeLabelId}>Tipo</InputLabel>
        <Select
          labelId={vehicleTypeLabelId}
          label="Tipo"
          value={vehicleType}
          onChange={(event) => onVehicleTypeChange(event.target.value as VehicleType)}
        >
          {vehicleTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth disabled={!brands.length || loadingBrands}>
        <InputLabel id={brandLabelId}>Marca</InputLabel>
        <Select
          labelId={brandLabelId}
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
        <InputLabel id={modelLabelId}>Modelo</InputLabel>
        <Select
          labelId={modelLabelId}
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
        <InputLabel id={yearLabelId}>Ano</InputLabel>
        <Select
          labelId={yearLabelId}
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
    </Stack>
  )
}