import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Stack,
  TextField,
} from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { useEffect } from 'react'
import type { ApiOption, VehicleType } from '../../../api/fipeApi'
import { DialogTitleWithIcon } from '../../../components/DialogTitleWithIcon'
import { FipeSelectors } from '../../../components/FipeSelectors'
import { FormSectionTitle } from '../../../components/FormSectionTitle'
import { SelectField } from '../../../components/SelectField'
import { doorOptions, fuelOptions, transmissionOptions } from '../../../shared/constants/vehicle'

type AddVehicleDialogProps = {
  open: boolean
  onClose: () => void
  onClearSubmitError: () => void
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
  loadingPrice: boolean
  fipeDisplay: string
  paidValueDisplay: string
  purchaseDateDisplay: string
  plate: string
  renavam: string
  color: string
  currentKmDisplay: string
  fuel: string
  transmission: string
  doors: string
  submitError: string
  savingVehicle: boolean
  onVehicleTypeChange: (value: VehicleType) => void
  onBrandChange: (value: string) => void
  onModelChange: (value: string) => void
  onYearChange: (value: string) => void
  onPaidValueChange: (value: string) => void
  onPurchaseDateChange: (value: string) => void
  onPlateChange: (value: string) => void
  onRenavamChange: (value: string) => void
  onColorChange: (value: string) => void
  onCurrentKmChange: (value: string) => void
  onFuelChange: (value: string) => void
  onTransmissionChange: (value: string) => void
  onDoorsChange: (value: string) => void
  onSubmit: () => void
}

export function AddVehicleDialog({
  open,
  onClose,
  onClearSubmitError,
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
  loadingPrice,
  fipeDisplay,
  paidValueDisplay,
  purchaseDateDisplay,
  plate,
  renavam,
  color,
  currentKmDisplay,
  fuel,
  transmission,
  doors,
  submitError,
  savingVehicle,
  onVehicleTypeChange,
  onBrandChange,
  onModelChange,
  onYearChange,
  onPaidValueChange,
  onPurchaseDateChange,
  onPlateChange,
  onRenavamChange,
  onColorChange,
  onCurrentKmChange,
  onFuelChange,
  onTransmissionChange,
  onDoorsChange,
  onSubmit,
}: AddVehicleDialogProps) {
  useEffect(() => {
    if (!submitError) {
      return
    }

    const timerId = window.setTimeout(() => {
      onClearSubmitError()
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [onClearSubmitError, submitError])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="add-car-dialog-title">
      <DialogTitleWithIcon
        id="add-car-dialog-title"
        icon={<DirectionsCarRoundedIcon />}
        title="Adicionar veículo ao estoque"
        subtitle="Preencha os dados abaixo para cadastrar o veículo"
      />

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={3}>
          {/* FIPE selectors section */}
          <Box>
            <FormSectionTitle
              icon={<DirectionsCarRoundedIcon fontSize="small" />}
              title="Identificação FIPE"
              marginBottom={0.5}
            />
            <FipeSelectors
              idPrefix="stock"
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
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* Financial section */}
          <Box>
            <FormSectionTitle
              icon={<SaveRoundedIcon fontSize="small" />}
              title="Informações financeiras"
              marginBottom={0.5}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Valor FIPE"
                  value={fipeDisplay}
                  disabled
                  placeholder={loadingPrice ? 'Buscando valor FIPE...' : 'Selecione marca, modelo e ano'}
                  fullWidth
                  helperText="Preenchido automaticamente"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Valor pago"
                  value={paidValueDisplay}
                  onChange={(event) => onPaidValueChange(event.target.value)}
                  placeholder="R$ 0,00"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Data da compra"
                  value={purchaseDateDisplay}
                  onChange={(event) => onPurchaseDateChange(event.target.value)}
                  placeholder="dd/mm/aaaa"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* Documents section */}
          <Box>
            <FormSectionTitle icon={<SaveRoundedIcon fontSize="small" />} title="Documentação" marginBottom={0.5} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Placa"
                  value={plate}
                  onChange={(event) => onPlateChange(event.target.value)}
                  placeholder="ABC1D23"
                  fullWidth
                  slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="RENAVAM"
                  value={renavam}
                  onChange={(event) => onRenavamChange(event.target.value)}
                  placeholder="Somente números"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* Vehicle details section */}
          <Box>
            <FormSectionTitle
              icon={<DirectionsCarRoundedIcon fontSize="small" />}
              title="Características do veículo"
              marginBottom={0.5}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Cor"
                  value={color}
                  onChange={(event) => onColorChange(event.target.value)}
                  placeholder="Ex: Branco"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="KM atual"
                  value={currentKmDisplay}
                  onChange={(event) => onCurrentKmChange(event.target.value)}
                  placeholder="Ex: 45000"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <SelectField
                  label="Combustível"
                  labelId="stock-fuel-label"
                  value={fuel}
                  options={fuelOptions}
                  onChange={onFuelChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <SelectField
                  label="Câmbio"
                  labelId="stock-transmission-label"
                  value={transmission}
                  options={transmissionOptions}
                  onChange={onTransmissionChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <SelectField
                  label="Nº de portas"
                  labelId="stock-doors-label"
                  value={doors}
                  options={doorOptions}
                  onChange={onDoorsChange}
                />
              </Grid>
            </Grid>
          </Box>

          {submitError && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {submitError}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={savingVehicle}
          startIcon={<SaveRoundedIcon />}
          sx={{ fontWeight: 700, minWidth: 140 }}
        >
          {savingVehicle ? 'Salvando...' : 'Salvar veículo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}