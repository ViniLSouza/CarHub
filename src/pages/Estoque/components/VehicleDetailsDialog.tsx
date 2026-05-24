import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { StockVehicle } from '../../../api/estoqueApi'
import { DialogTitleWithIcon } from '../../../components/DialogTitleWithIcon'
import { FormSectionTitle } from '../../../components/FormSectionTitle'
import { formatDateDisplay, toCurrencyDisplayFromInput } from '../../../shared/utils/formatters'
import type { VehicleDetailsForm } from '../types'

type VehicleDetailsDialogProps = {
  open: boolean
  onClose: () => void
  loadingVehicleDetails: boolean
  updatingVehicleDetails: boolean
  deletingVehicleDetails: boolean
  vehicleDetailsError: string
  vehicleDetailsSuccess: string
  selectedVehicleDetails: StockVehicle | null
  vehicleDetailsForm: VehicleDetailsForm
  setVehicleDetailsForm: Dispatch<SetStateAction<VehicleDetailsForm>>
  onDelete: () => void
  onUpdate: () => void
}

export function VehicleDetailsDialog({
  open,
  onClose,
  loadingVehicleDetails,
  updatingVehicleDetails,
  deletingVehicleDetails,
  vehicleDetailsError,
  vehicleDetailsSuccess,
  selectedVehicleDetails,
  vehicleDetailsForm,
  setVehicleDetailsForm,
  onDelete,
  onUpdate,
}: VehicleDetailsDialogProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const isDisabled = !selectedVehicleDetails || loadingVehicleDetails || updatingVehicleDetails || deletingVehicleDetails

  useEffect(() => {
    if (!open) {
      setIsDeleteConfirmOpen(false)
    }
  }, [open])

  const handleRequestDelete = () => {
    setIsDeleteConfirmOpen(true)
  }

  const handleCloseDeleteConfirm = () => {
    if (deletingVehicleDetails) {
      return
    }

    setIsDeleteConfirmOpen(false)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setIsDeleteConfirmOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="vehicle-details-dialog-title"
    >
      <DialogTitleWithIcon
        id="vehicle-details-dialog-title"
        icon={<DirectionsCarRoundedIcon />}
        title="Detalhes do veículo"
        subtitle="Visualize e edite as informações do veículo"
      />

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          {loadingVehicleDetails && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Carregando detalhes do veículo...
              </Typography>
            </Stack>
          )}

          {vehicleDetailsError && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {vehicleDetailsError}
            </Alert>
          )}

          {vehicleDetailsSuccess && (
            <Alert severity="success" sx={{ borderRadius: 3 }}>
              {vehicleDetailsSuccess}
            </Alert>
          )}

          {!loadingVehicleDetails && selectedVehicleDetails && (
            <>
              {/* Vehicle identity */}
              <Box>
                <FormSectionTitle title="Identificação" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Marca" value={vehicleDetailsForm.brand} disabled fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Modelo" value={vehicleDetailsForm.model} disabled fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Ano" value={vehicleDetailsForm.year} disabled fullWidth />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Documents */}
              <Box>
                <FormSectionTitle title="Documentação" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Placa"
                      value={vehicleDetailsForm.plate}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, plate: event.target.value.toUpperCase() }))
                      }}
                      fullWidth
                      slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="RENAVAM"
                      value={vehicleDetailsForm.renavam}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          renavam: event.target.value.replace(/\D/g, '').slice(0, 11),
                        }))
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Vehicle details */}
              <Box>
                <FormSectionTitle title="Características" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Cor"
                      value={vehicleDetailsForm.color}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, color: event.target.value }))
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="KM atual"
                      value={vehicleDetailsForm.currentKm}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          currentKm: event.target.value.replace(/\D/g, ''),
                        }))
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Número de portas"
                      value={vehicleDetailsForm.doors}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, doors: event.target.value.replace(/\D/g, '') }))
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Combustível"
                      value={vehicleDetailsForm.fuel}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, fuel: event.target.value }))
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Câmbio"
                      value={vehicleDetailsForm.transmission}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, transmission: event.target.value }))
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Financial */}
              <Box>
                <FormSectionTitle title="Financeiro" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="FIPE"
                      value={vehicleDetailsForm.fipe}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          fipe: toCurrencyDisplayFromInput(event.target.value),
                        }))
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Valor pago"
                      value={vehicleDetailsForm.paidValue}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          paidValue: toCurrencyDisplayFromInput(event.target.value),
                        }))
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Data da compra"
                      value={vehicleDetailsForm.purchaseDate}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          purchaseDate: formatDateDisplay(event.target.value),
                        }))
                      }}
                      placeholder="dd/mm/aaaa"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        <Button
          color="error"
          variant="outlined"
          onClick={handleRequestDelete}
          disabled={isDisabled}
          startIcon={<DeleteOutlineRoundedIcon />}
          sx={{
            fontWeight: 700,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {deletingVehicleDetails ? 'Excluindo...' : 'Excluir'}
        </Button>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            ml: { sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600, flex: { xs: 1, sm: 'none' } }}>
            Fechar
          </Button>
          <Button
            variant="contained"
            onClick={onUpdate}
            disabled={isDisabled}
            startIcon={<SaveRoundedIcon />}
            sx={{ fontWeight: 700, minWidth: 160, flex: { xs: 1, sm: 'none' } }}
          >
            {updatingVehicleDetails ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Stack>
      </DialogActions>

      <Dialog
        open={isDeleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="confirm-delete-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tem certeza que deseja excluir este veículo? Essa ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} color="inherit" disabled={deletingVehicleDetails}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deletingVehicleDetails}
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ fontWeight: 700 }}
          >
            {deletingVehicleDetails ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}