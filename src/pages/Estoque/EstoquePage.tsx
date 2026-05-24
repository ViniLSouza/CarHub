import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import {
  Box,
  Button,
  Chip,
  Stack,
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
import {
  formatCurrencyDisplay,
  formatDateDisplay,
  parseApiPriceToNumber,
  parseDisplayCurrencyToNumber,
  toDisplayDate,
  toCurrencyDisplayFromInput,
  toIsoDate,
} from '../../shared/utils/formatters'
import { ApiResponseDialog } from '../../components/ApiResponseDialog'
import { GradientHeroCard } from '../../components/GradientHeroCard'
import { AddVehicleDialog } from './components/AddVehicleDialog'
import { StockVehiclesTable, type StockCarRow } from './components/StockVehiclesTable'
import { VehicleDetailsDialog } from './components/VehicleDetailsDialog'
import { EMPTY_VEHICLE_DETAILS_FORM, type VehicleDetailsForm } from './types'

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
  const [apiResponseDialog, setApiResponseDialog] = useState<{
    open: boolean
    title: string
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    title: '',
    message: '',
    severity: 'success',
  })
  const [stockCarsError, setStockCarsError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const openApiResponseDialog = (title: string, message: string, severity: 'success' | 'error') => {
    setApiResponseDialog({ open: true, title, message, severity })
  }

  const closeApiResponseDialog = () => {
    setApiResponseDialog((prev) => ({ ...prev, open: false }))
  }

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
    const fipeValue = parseDisplayCurrencyToNumber(vehicleDetailsForm.fipe)
    const paidValue = parseDisplayCurrencyToNumber(vehicleDetailsForm.paidValue)
    const purchaseDate = toIsoDate(vehicleDetailsForm.purchaseDate)

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
      !purchaseDate ||
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
      purchaseDate,
    }

    setUpdatingVehicleDetails(true)
    setVehicleDetailsError('')
    setVehicleDetailsSuccess('')

    try {
      const updatedVehicle = await updateVehicleApi(selectedVehicleDetails.id, payload)
      setSelectedVehicleDetails(updatedVehicle)
      setVehicleDetailsForm(mapVehicleToDetailsForm(updatedVehicle))
      setVehicleDetailsSuccess('')
      openApiResponseDialog('Atualizacao concluida', 'Veiculo atualizado com sucesso.', 'success')
      await loadStockCars()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Nao foi possivel atualizar o veiculo.'
      setVehicleDetailsError('')
      openApiResponseDialog('Falha na atualizacao', errorMessage, 'error')
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
      openApiResponseDialog('Exclusao concluida', 'Veiculo excluido com sucesso.', 'success')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Nao foi possivel excluir o veiculo.'
      setVehicleDetailsError('')
      openApiResponseDialog('Falha na exclusao', errorMessage, 'error')
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
      openApiResponseDialog('Cadastro concluido', 'Veiculo cadastrado com sucesso.', 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nao foi possivel salvar o veiculo.'
      setSubmitError('')
      openApiResponseDialog('Falha no cadastro', errorMessage, 'error')
    } finally {
      setSavingVehicle(false)
    }
  }

  return (
    <Stack spacing={3}>
      <GradientHeroCard
        chip={
          <Chip
            icon={<Inventory2RoundedIcon />}
            label="Gestão de estoque"
            sx={{
              width: 'fit-content',
              fontWeight: 700,
              bgcolor: 'rgba(56,189,248,0.18)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.3)',
              '& .MuiChip-icon': { color: '#38bdf8' },
            }}
          />
        }
        title={
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
            Veículos{' '}
            <Box component="span" sx={{ color: '#38bdf8' }}>
              disponíveis no pátio
            </Box>
          </Typography>
        }
        description={
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.75, lineHeight: 1.6 }}>
            Visualize, edite e gerencie os veículos cadastrados no estoque.
          </Typography>
        }
        sideContent={
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={handleOpenModal}
            sx={{
              flexShrink: 0,
              fontWeight: 700,
              bgcolor: '#38bdf8',
              color: '#0d1b2a',
              '&:hover': { bgcolor: '#0ea5e9', boxShadow: '0 4px 16px rgba(56,189,248,0.45)' },
            }}
          >
            Adicionar veículo
          </Button>
        }
      />

      <StockVehiclesTable
        rows={stockCars}
        loading={loadingStockCars}
        errorMessage={stockCarsError}
        onOpenDetails={(vehicleId) => {
          void handleOpenDetails(vehicleId)
        }}
      />

      <AddVehicleDialog
        open={isModalOpen}
        onClose={handleCloseModal}
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
        loadingPrice={loadingPrice}
        fipeDisplay={fipeDisplay}
        paidValueDisplay={paidValueDisplay}
        purchaseDateDisplay={purchaseDateDisplay}
        plate={plate}
        renavam={renavam}
        color={color}
        currentKmDisplay={currentKmDisplay}
        fuel={fuel}
        transmission={transmission}
        doors={doors}
        submitError={submitError}
        savingVehicle={savingVehicle}
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
        onPaidValueChange={(value) => setPaidValueDisplay(toCurrencyDisplayFromInput(value))}
        onPurchaseDateChange={(value) => setPurchaseDateDisplay(formatDateDisplay(value))}
        onPlateChange={(value) => setPlate(value)}
        onRenavamChange={(value) => setRenavam(value.replace(/\D/g, '').slice(0, 11))}
        onColorChange={(value) => setColor(value)}
        onCurrentKmChange={(value) => setCurrentKmDisplay(value.replace(/\D/g, ''))}
        onFuelChange={(value) => setFuel(value)}
        onTransmissionChange={(value) => setTransmission(value)}
        onDoorsChange={(value) => setDoors(value)}
        onSubmit={() => {
          void handleSubmit()
        }}
      />

      <VehicleDetailsDialog
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        loadingVehicleDetails={loadingVehicleDetails}
        updatingVehicleDetails={updatingVehicleDetails}
        deletingVehicleDetails={deletingVehicleDetails}
        vehicleDetailsError={vehicleDetailsError}
        vehicleDetailsSuccess={vehicleDetailsSuccess}
        selectedVehicleDetails={selectedVehicleDetails}
        vehicleDetailsForm={vehicleDetailsForm}
        setVehicleDetailsForm={setVehicleDetailsForm}
        onDelete={() => {
          void handleDeleteVehicleDetails()
        }}
        onUpdate={() => {
          void handleUpdateVehicleDetails()
        }}
      />

      <ApiResponseDialog
        open={apiResponseDialog.open}
        title={apiResponseDialog.title}
        message={apiResponseDialog.message}
        severity={apiResponseDialog.severity}
        onClose={closeApiResponseDialog}
      />
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
    fipe: formatCurrencyDisplay(vehicle.fipe),
    paidValue: formatCurrencyDisplay(vehicle.paidValue),
    purchaseDate: toDisplayDate(vehicle.purchaseDate),
  }
}