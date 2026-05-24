import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  createVehicleApi,
  deleteVehicleApi,
  fetchVehicleByIdApi,
  fetchVehiclesApi,
  updateVehicleApi,
  type CreateVehiclePayload,
  type StockVehicle,
} from '../../api/estoqueApi'
import {
  fetchBrandsApi,
  fetchModelsApi,
  fetchPriceApi,
  fetchYearsApi,
  getOptionId,
  getOptionName,
  type ApiOption,
  type VehicleType,
} from '../../api/fipeApi'
import { FipeSelectors } from '../../components/FipeSelectors'
import { doorOptions, fuelOptions, transmissionOptions } from '../../shared/constants/vehicle'
import {
  formatCurrencyDisplay,
  formatDateDisplay,
  parseApiPriceToNumber,
  parseDisplayCurrencyToNumber,
  toCurrencyDisplayFromInput,
  toIsoDate,
} from '../../shared/utils/formatters'
import { StockVehiclesTable, type StockCarRow } from './components/StockVehiclesTable'

type VehicleDetailsForm = {
  type: string
  brand: string
  model: string
  year: string
  plate: string
  renavam: string
  color: string
  currentKm: string
  fuel: string
  transmission: string
  doors: string
  fipe: string
  paidValue: string
  purchaseDate: string
}

const EMPTY_VEHICLE_DETAILS_FORM: VehicleDetailsForm = {
  type: '',
  brand: '',
  model: '',
  year: '',
  plate: '',
  renavam: '',
  color: '',
  currentKm: '',
  fuel: '',
  transmission: '',
  doors: '',
  fipe: '',
  paidValue: '',
  purchaseDate: '',
}

function mapVehicleToStockCar(vehicle: StockVehicle): StockCarRow {
  const parsedYear = Number(vehicle.year)

  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear(),
  }
}

export function EstoquePage() {
  const [stockCars, setStockCars] = useState<StockCarRow[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicleType, setVehicleType] = useState<VehicleType>('carros')
  const [brandId, setBrandId] = useState('')
  const [modelId, setModelId] = useState('')
  const [yearId, setYearId] = useState('')
  const [fipeDisplay, setFipeDisplay] = useState('')
  const [paidValueDisplay, setPaidValueDisplay] = useState('')
  const [purchaseDateDisplay, setPurchaseDateDisplay] = useState('')
  const [plate, setPlate] = useState('')
  const [renavam, setRenavam] = useState('')
  const [color, setColor] = useState('')
  const [currentKmDisplay, setCurrentKmDisplay] = useState('')
  const [fuel, setFuel] = useState('')
  const [transmission, setTransmission] = useState('')
  const [doors, setDoors] = useState('')
  const [brands, setBrands] = useState<ApiOption[]>([])
  const [models, setModels] = useState<ApiOption[]>([])
  const [years, setYears] = useState<ApiOption[]>([])
  const [loadingBrands, setLoadingBrands] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [loadingStockCars, setLoadingStockCars] = useState(false)
  const [savingVehicle, setSavingVehicle] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [loadingVehicleDetails, setLoadingVehicleDetails] = useState(false)
  const [updatingVehicleDetails, setUpdatingVehicleDetails] = useState(false)
  const [deletingVehicleDetails, setDeletingVehicleDetails] = useState(false)
  const [vehicleDetailsError, setVehicleDetailsError] = useState('')
  const [vehicleDetailsSuccess, setVehicleDetailsSuccess] = useState('')
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<StockVehicle | null>(null)
  const [vehicleDetailsForm, setVehicleDetailsForm] = useState<VehicleDetailsForm>(
    EMPTY_VEHICLE_DETAILS_FORM,
  )
  const [stockCarsError, setStockCarsError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const selectedBrandName = useMemo(
    () => {
      const found = brands.find((item) => getOptionId(item) === brandId)
      return found ? getOptionName(found) : '-'
    },
    [brands, brandId],
  )

  const selectedModelName = useMemo(
    () => {
      const found = models.find((item) => getOptionId(item) === modelId)
      return found ? getOptionName(found) : '-'
    },
    [models, modelId],
  )

  const loadStockCars = async () => {
    setLoadingStockCars(true)
    setStockCarsError('')

    try {
      const vehicles = await fetchVehiclesApi()
      setStockCars(vehicles.map(mapVehicleToStockCar))
    } catch {
      setStockCarsError('Nao foi possivel carregar os veiculos cadastrados no estoque.')
      setStockCars([])
    } finally {
      setLoadingStockCars(false)
    }
  }

  useEffect(() => {
    void loadStockCars()
  }, [])

  const clearDependentFieldsFromType = () => {
    setBrandId('')
    setModelId('')
    setYearId('')
    setModels([])
    setYears([])
    setFipeDisplay('')
  }

  const clearDependentFieldsFromBrand = () => {
    setModelId('')
    setYearId('')
    setYears([])
    setFipeDisplay('')
  }

  const clearDependentFieldsFromModel = () => {
    setYearId('')
    setFipeDisplay('')
  }

  useEffect(() => {
    let isActive = true

    const run = async () => {
      setLoadingBrands(true)

      try {
        const data = await fetchBrandsApi(vehicleType)

        if (isActive) {
          setBrands(data)
        }
      } catch {
        if (isActive) {
          setBrands([])
        }
      } finally {
        if (isActive) {
          setLoadingBrands(false)
        }
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [vehicleType])

  useEffect(() => {
    if (!brandId) {
      return
    }

    let isActive = true

    const run = async () => {
      setLoadingModels(true)

      try {
        const data = await fetchModelsApi(vehicleType, brandId)

        if (isActive) {
          setModels(data)
        }
      } catch {
        if (isActive) {
          setModels([])
        }
      } finally {
        if (isActive) {
          setLoadingModels(false)
        }
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [vehicleType, brandId])

  useEffect(() => {
    if (!brandId || !modelId) {
      return
    }

    let isActive = true

    const run = async () => {
      setLoadingYears(true)

      try {
        const data = await fetchYearsApi(vehicleType, brandId, modelId)

        if (isActive) {
          setYears(data)
        }
      } catch {
        if (isActive) {
          setYears([])
        }
      } finally {
        if (isActive) {
          setLoadingYears(false)
        }
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [vehicleType, brandId, modelId])

  useEffect(() => {
    if (!brandId || !modelId || !yearId) {
      return
    }

    let isActive = true

    const run = async () => {
      setLoadingPrice(true)

      try {
        const data = await fetchPriceApi(vehicleType, brandId, modelId, yearId)

        if (isActive) {
          const numberValue = parseApiPriceToNumber(data.price)
          setFipeDisplay(numberValue ? formatCurrencyDisplay(numberValue) : '')
        }
      } catch {
        if (isActive) {
          setFipeDisplay('')
        }
      } finally {
        if (isActive) {
          setLoadingPrice(false)
        }
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [vehicleType, brandId, modelId, yearId])

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setSubmitError('')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSubmitError('')
    setVehicleType('carros')
    setBrandId('')
    setModelId('')
    setYearId('')
    setFipeDisplay('')
    setPaidValueDisplay('')
    setPurchaseDateDisplay('')
    setPlate('')
    setRenavam('')
    setColor('')
    setCurrentKmDisplay('')
    setFuel('')
    setTransmission('')
    setDoors('')
    setModels([])
    setYears([])
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setLoadingVehicleDetails(false)
    setUpdatingVehicleDetails(false)
    setDeletingVehicleDetails(false)
    setVehicleDetailsError('')
    setVehicleDetailsSuccess('')
    setSelectedVehicleDetails(null)
    setVehicleDetailsForm(EMPTY_VEHICLE_DETAILS_FORM)
  }

  const handleOpenDetails = async (vehicleId: number) => {
    setIsDetailsModalOpen(true)
    setLoadingVehicleDetails(true)
    setVehicleDetailsError('')
    setVehicleDetailsSuccess('')
    setSelectedVehicleDetails(null)
    setVehicleDetailsForm(EMPTY_VEHICLE_DETAILS_FORM)

    try {
      const vehicle = await fetchVehicleByIdApi(vehicleId)
      setSelectedVehicleDetails(vehicle)
      setVehicleDetailsForm(mapVehicleToDetailsForm(vehicle))
    } catch (error) {
      setVehicleDetailsError(
        error instanceof Error ? error.message : 'Nao foi possivel carregar os detalhes do veiculo.',
      )
    } finally {
      setLoadingVehicleDetails(false)
    }
  }

  const handleUpdateVehicleDetails = async () => {
    if (!selectedVehicleDetails) {
      return
    }

    const currentKm = Number(vehicleDetailsForm.currentKm)
    const doorsCount = Number(vehicleDetailsForm.doors)
    const fipeValue = Number(vehicleDetailsForm.fipe)
    const paidValue = Number(vehicleDetailsForm.paidValue)

    if (
      !vehicleDetailsForm.type.trim() ||
      !vehicleDetailsForm.brand.trim() ||
      !vehicleDetailsForm.model.trim() ||
      !vehicleDetailsForm.year.trim() ||
      !vehicleDetailsForm.plate.trim() ||
      !vehicleDetailsForm.renavam.trim() ||
      !vehicleDetailsForm.color.trim() ||
      !vehicleDetailsForm.fuel.trim() ||
      !vehicleDetailsForm.transmission.trim() ||
      !vehicleDetailsForm.purchaseDate.trim() ||
      !Number.isFinite(currentKm) ||
      currentKm <= 0 ||
      !Number.isFinite(doorsCount) ||
      doorsCount <= 0 ||
      !Number.isFinite(fipeValue) ||
      fipeValue <= 0 ||
      !Number.isFinite(paidValue) ||
      paidValue <= 0
    ) {
      setVehicleDetailsError('Preencha todos os campos corretamente para atualizar o veiculo.')
      setVehicleDetailsSuccess('')
      return
    }

    const payload: CreateVehiclePayload = {
      type: vehicleDetailsForm.type.trim(),
      brand: vehicleDetailsForm.brand.trim(),
      model: vehicleDetailsForm.model.trim(),
      year: vehicleDetailsForm.year.trim(),
      plate: vehicleDetailsForm.plate.trim().toUpperCase(),
      renavam: vehicleDetailsForm.renavam.replace(/\D/g, ''),
      color: vehicleDetailsForm.color.trim(),
      currentKm,
      fuel: vehicleDetailsForm.fuel.trim(),
      transmission: vehicleDetailsForm.transmission.trim(),
      doors: doorsCount,
      fipe: fipeValue,
      paidValue,
      purchaseDate: vehicleDetailsForm.purchaseDate.trim(),
    }

    setUpdatingVehicleDetails(true)
    setVehicleDetailsError('')
    setVehicleDetailsSuccess('')

    try {
      const updatedVehicle = await updateVehicleApi(selectedVehicleDetails.id, payload)
      setSelectedVehicleDetails(updatedVehicle)
      setVehicleDetailsForm(mapVehicleToDetailsForm(updatedVehicle))
      setVehicleDetailsSuccess('Veiculo atualizado com sucesso.')
      await loadStockCars()
    } catch (error) {
      setVehicleDetailsError(error instanceof Error ? error.message : 'Nao foi possivel atualizar o veiculo.')
    } finally {
      setUpdatingVehicleDetails(false)
    }
  }

  const handleDeleteVehicleDetails = async () => {
    if (!selectedVehicleDetails) {
      return
    }

    setDeletingVehicleDetails(true)
    setVehicleDetailsError('')
    setVehicleDetailsSuccess('')

    try {
      await deleteVehicleApi(selectedVehicleDetails.id)
      await loadStockCars()
      handleCloseDetailsModal()
    } catch (error) {
      setVehicleDetailsError(error instanceof Error ? error.message : 'Nao foi possivel excluir o veiculo.')
    } finally {
      setDeletingVehicleDetails(false)
    }
  }

  const handleSubmit = async () => {
    const fipeValue = parseDisplayCurrencyToNumber(fipeDisplay)
    const paidValue = parseDisplayCurrencyToNumber(paidValueDisplay)
    const purchaseDate = toIsoDate(purchaseDateDisplay)
    const currentKm = Number(currentKmDisplay.replace(/\D/g, ''))
    const normalizedPlate = plate.trim().toUpperCase()
    const normalizedRenavam = renavam.replace(/\D/g, '')
    const normalizedColor = color.trim()
    const doorCount = Number(doors)
    const selectedYearText = years.find((item) => getOptionId(item) === yearId)?.name ?? yearId

    if (
      !brandId ||
      !modelId ||
      !yearId ||
      !normalizedPlate ||
      !normalizedRenavam ||
      !normalizedColor ||
      selectedBrandName === '-' ||
      selectedModelName === '-' ||
      !currentKm ||
      !fuel ||
      !transmission ||
      !doorCount ||
      !fipeValue ||
      !paidValue ||
      !purchaseDate ||
      !selectedYearText
    ) {
      setSubmitError('Preencha todos os campos obrigatorios para salvar o veiculo.')
      return
    }

    const payload: CreateVehiclePayload = {
      type: vehicleType,
      brand: selectedBrandName,
      model: selectedModelName,
      year: selectedYearText,
      plate: normalizedPlate,
      renavam: normalizedRenavam,
      color: normalizedColor,
      currentKm,
      fuel,
      transmission,
      doors: doorCount,
      fipe: fipeValue,
      paidValue,
      purchaseDate,
    }

    setSavingVehicle(true)

    try {
      const createdVehicle = await createVehicleApi(payload)

      setStockCars((prev) => [
        {
          id: createdVehicle.id,
          brand: createdVehicle.brand,
          model: createdVehicle.model,
          year: Number(createdVehicle.year) || new Date().getFullYear(),
        },
        ...prev,
      ])

      handleCloseModal()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Nao foi possivel salvar o veiculo.')
    } finally {
      setSavingVehicle(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'rgba(20, 40, 80, 0.10)',
          p: { xs: 2, md: 3 },
          background:
            'linear-gradient(135deg, rgba(29, 79, 145, 0.10) 0%, rgba(255, 255, 255, 1) 62%)',
        }}
      >
        <Stack spacing={2}>
          <Chip
            icon={<Inventory2RoundedIcon />}
            label="Estoque de carros"
            sx={{ width: 'fit-content', fontWeight: 600 }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#13233e' }}>
                Carros disponíveis no pátio
              </Typography>
              <Typography sx={{ color: '#4a5b78', mt: 0.5 }}>
                Visualize rapidamente marca, modelo e ano dos veículos cadastrados.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddCircleOutlineRoundedIcon />}
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 999,
                px: 2.5,
                bgcolor: '#1d4f91',
                '&:hover': { bgcolor: '#153f75' },
              }}
            >
              Adicionar carro
            </Button>
          </Box>
        </Stack>
      </Paper>

      <StockVehiclesTable
        rows={stockCars}
        loading={loadingStockCars}
        errorMessage={stockCarsError}
        onOpenDetails={(vehicleId) => {
          void handleOpenDetails(vehicleId)
        }}
      />

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        aria-labelledby="add-car-dialog-title"
      >
        <DialogTitle id="add-car-dialog-title" sx={{ fontWeight: 700 }}>
          Adicionar veiculo ao estoque
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
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
              onVehicleTypeChange={(value) => {
                setVehicleType(value)
                clearDependentFieldsFromType()
              }}
              onBrandChange={(value) => {
                setBrandId(value)
                clearDependentFieldsFromBrand()
              }}
              onModelChange={(value) => {
                setModelId(value)
                clearDependentFieldsFromModel()
              }}
              onYearChange={(value) => setYearId(value)}
            />

            <TextField
              label="Fipe"
              value={fipeDisplay}
              disabled
              placeholder={loadingPrice ? 'Carregando valor FIPE...' : 'Selecione os filtros acima'}
              fullWidth
            />

            <TextField
              label="Valor pago"
              value={paidValueDisplay}
              onChange={(event) => {
                setPaidValueDisplay(toCurrencyDisplayFromInput(event.target.value))
              }}
              placeholder="R$0,00"
              fullWidth
            />

            <TextField
              label="Data da compra"
              value={purchaseDateDisplay}
              onChange={(event) => {
                setPurchaseDateDisplay(formatDateDisplay(event.target.value))
              }}
              placeholder="dd/mm/aaaa"
              fullWidth
            />

            <TextField
              label="Placa"
              value={plate}
              onChange={(event) => {
                setPlate(event.target.value)
              }}
              placeholder="ABC1D23"
              fullWidth
            />

            <TextField
              label="Renavam"
              value={renavam}
              onChange={(event) => {
                setRenavam(event.target.value.replace(/\D/g, '').slice(0, 11))
              }}
              placeholder="Somente numeros"
              fullWidth
            />

            <TextField
              label="Cor"
              value={color}
              onChange={(event) => {
                setColor(event.target.value)
              }}
              placeholder="Ex: Branco"
              fullWidth
            />

            <TextField
              label="KM atual"
              value={currentKmDisplay}
              onChange={(event) => {
                setCurrentKmDisplay(event.target.value.replace(/\D/g, ''))
              }}
              placeholder="Ex: 45000"
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="stock-fuel-label">Combustivel</InputLabel>
              <Select
                labelId="stock-fuel-label"
                label="Combustivel"
                value={fuel}
                onChange={(event) => setFuel(event.target.value)}
              >
                {fuelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="stock-transmission-label">Cambio</InputLabel>
              <Select
                labelId="stock-transmission-label"
                label="Cambio"
                value={transmission}
                onChange={(event) => setTransmission(event.target.value)}
              >
                {transmissionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="stock-doors-label">Numero de portas</InputLabel>
              <Select
                labelId="stock-doors-label"
                label="Numero de portas"
                value={doors}
                onChange={(event) => setDoors(event.target.value)}
              >
                {doorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {submitError && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                {submitError}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseModal} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleSubmit()
            }}
            disabled={savingVehicle}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#1d4f91' }}
          >
            {savingVehicle ? 'Salvando...' : 'Salvar veiculo'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        fullWidth
        maxWidth="sm"
        aria-labelledby="vehicle-details-dialog-title"
      >
        <DialogTitle id="vehicle-details-dialog-title" sx={{ fontWeight: 700 }}>
          Detalhes do veiculo
        </DialogTitle>

        <DialogContent>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            {loadingVehicleDetails && (
              <Typography sx={{ color: '#4a5b78' }}>Carregando detalhes...</Typography>
            )}

            {vehicleDetailsError && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                {vehicleDetailsError}
              </Alert>
            )}

            {vehicleDetailsSuccess && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {vehicleDetailsSuccess}
              </Alert>
            )}

            {!loadingVehicleDetails && selectedVehicleDetails && (
              <>
                <TextField
                  label="Marca"
                  value={vehicleDetailsForm.brand}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Modelo"
                  value={vehicleDetailsForm.model}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Ano"
                  value={vehicleDetailsForm.year}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Placa"
                  value={vehicleDetailsForm.plate}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, plate: event.target.value.toUpperCase() }))
                  }}
                  fullWidth
                />
                <TextField
                  label="Renavam"
                  value={vehicleDetailsForm.renavam}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({
                      ...prev,
                      renavam: event.target.value.replace(/\D/g, '').slice(0, 11),
                    }))
                  }}
                  fullWidth
                />
                <TextField
                  label="Cor"
                  value={vehicleDetailsForm.color}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, color: event.target.value }))
                  }}
                  fullWidth
                />
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
                <TextField
                  label="Combustivel"
                  value={vehicleDetailsForm.fuel}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, fuel: event.target.value }))
                  }}
                  fullWidth
                />
                <TextField
                  label="Cambio"
                  value={vehicleDetailsForm.transmission}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, transmission: event.target.value }))
                  }}
                  fullWidth
                />
                <TextField
                  label="Portas"
                  value={vehicleDetailsForm.doors}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, doors: event.target.value.replace(/\D/g, '') }))
                  }}
                  fullWidth
                />
                <TextField
                  label="FIPE"
                  value={vehicleDetailsForm.fipe}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, fipe: event.target.value.replace(',', '.') }))
                  }}
                  fullWidth
                />
                <TextField
                  label="Valor pago"
                  value={vehicleDetailsForm.paidValue}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, paidValue: event.target.value.replace(',', '.') }))
                  }}
                  fullWidth
                />
                <TextField
                  label="Data da compra"
                  value={vehicleDetailsForm.purchaseDate}
                  onChange={(event) => {
                    setVehicleDetailsForm((prev) => ({ ...prev, purchaseDate: event.target.value }))
                  }}
                  placeholder="AAAA-MM-DD"
                  fullWidth
                />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            color="error"
            onClick={() => {
              void handleDeleteVehicleDetails()
            }}
            disabled={!selectedVehicleDetails || loadingVehicleDetails || updatingVehicleDetails || deletingVehicleDetails}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            {deletingVehicleDetails ? 'Excluindo...' : 'Excluir'}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleUpdateVehicleDetails()
            }}
            disabled={!selectedVehicleDetails || loadingVehicleDetails || updatingVehicleDetails || deletingVehicleDetails}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#1d4f91' }}
          >
            {updatingVehicleDetails ? 'Atualizando...' : 'Salvar alteracoes'}
          </Button>
          <Button onClick={handleCloseDetailsModal} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

function mapVehicleToDetailsForm(vehicle: StockVehicle): VehicleDetailsForm {
  return {
    type: vehicle.type,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
    renavam: vehicle.renavam,
    color: vehicle.color,
    currentKm: String(vehicle.currentKm),
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    doors: String(vehicle.doors),
    fipe: String(vehicle.fipe),
    paidValue: String(vehicle.paidValue),
    purchaseDate: vehicle.purchaseDate,
  }
}