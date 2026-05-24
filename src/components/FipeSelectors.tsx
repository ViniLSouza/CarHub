import { Grid } from '@mui/material'
import { getOptionId, getOptionName, type ApiOption, type VehicleType } from '../api/fipeApi'
import { SelectField } from './SelectField'
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
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <SelectField
          label="Tipo de veículo"
          labelId={vehicleTypeLabelId}
          value={vehicleType}
          options={vehicleTypeOptions}
          onChange={(value) => onVehicleTypeChange(value as VehicleType)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <SelectField
          label={loadingBrands ? 'Carregando marcas...' : 'Marca'}
          labelId={brandLabelId}
          value={brandId}
          disabled={!brands.length || loadingBrands}
          options={brands.map((brand) => ({
            value: getOptionId(brand),
            label: getOptionName(brand),
          }))}
          onChange={onBrandChange}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <SelectField
          label={loadingModels ? 'Carregando modelos...' : 'Modelo'}
          labelId={modelLabelId}
          value={modelId}
          disabled={loadingModels || !brandId || !models.length}
          options={models.map((model) => ({
            value: getOptionId(model),
            label: getOptionName(model),
          }))}
          onChange={onModelChange}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <SelectField
          label={loadingYears ? 'Carregando anos...' : 'Ano'}
          labelId={yearLabelId}
          value={yearId}
          disabled={!modelId || loadingYears || !years.length}
          options={years.map((year) => ({
            value: getOptionId(year),
            label: getOptionName(year),
          }))}
          onChange={onYearChange}
        />
      </Grid>
    </Grid>
  )
}