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
  type CreateVehiclePayload,
  type StockVehicle,
} from '../../api/estoqueApi'
import {
  clearStockVehicleMessages,
  clearStockExpenseMessages,
  clearSoldStockVehiclesError,
  clearStockVehiclesError,
  createStockVehicle,
  deleteStockVehicle,
  fetchBrands,
  fetchModels,
  fetchPrice,
  fetchSoldStockVehicles,
  fetchStockVehicleById,
  fetchStockVehicles,
  fetchYears,
  sellStockVehicle,
  setStockVehicleError,
  updateStockVehicle,
  clearError,
  clearModelsAndBelow,
  clearPrice,
  clearYearsAndPrice,
} from '../../store'
import {
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
import {
  useAppDispatch,
  useAppSelector,
} from '../../store'

function mapVehicleToStockCar(vehicle: StockVehicle): StockCarRow {
  const parsedYear = Number(vehicle.year)

  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear(),
    soldValue: vehicle.soldValue,
    totalCost: vehicle.totalCost,
    soldDate: vehicle.soldDate,
    buyerName: vehicle.buyerName,
    buyerDocument: vehicle.buyerDocument,
    buyerPhone: vehicle.buyerPhone,
    sellerName: vehicle.sellerName,
  }
}

export function EstoquePage() {
  const dispatch = useAppDispatch()
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
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
  const {
    brands,
    models,
    years,
    priceData,
    loadingBrands,
    loadingModels,
    loadingYears,
    loadingPrice,
    errorMessage: fipeErrorMessage,
  } = useAppSelector((state) => state.fipe)
  const {
    vehicles,
    soldVehicles,
    selectedVehicle,
    expenses,
    loadingVehicles,
    loadingSoldVehicles,
    loadingVehicle,
    loadingExpenses,
    savingVehicle,
    sellingVehicle,
    updatingVehicle,
    deletingVehicle,
    savingExpense,
    updatingExpense,
    deletingExpense,
    vehiclesError,
    soldVehiclesError,
    vehicleError,
    vehicleSuccess,
    expensesError,
    expensesSuccess,
  } = useAppSelector((state) => state.stock)

  const stockCars = useMemo(() => vehicles.map(mapVehicleToStockCar), [vehicles])
  const soldStockCars = useMemo(() => soldVehicles.map(mapVehicleToStockCar), [soldVehicles])
  const selectedVehicleDetails = selectedVehicle
  const isVehicleBusy = loadingVehicle || updatingVehicle || deletingVehicle
  const isExpenseBusy = loadingExpenses || savingExpense || updatingExpense || deletingExpense

  const openApiResponseDialog = (title: string, message: string, severity: 'success' | 'error') => {
    setApiResponseDialog({ open: true, title, message, severity })
  }

  const closeApiResponseDialog = () => {
    setApiResponseDialog((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    if (!vehiclesError) {
      return
    }

    const timerId = window.setTimeout(() => {
      dispatch(clearStockVehiclesError())
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dispatch, vehiclesError])

  useEffect(() => {
    if (!soldVehiclesError) {
      return
    }

    const timerId = window.setTimeout(() => {
      dispatch(clearSoldStockVehiclesError())
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dispatch, soldVehiclesError])

  useEffect(() => {
    if (!vehicleError && !vehicleSuccess) {
      return
    }

    const timerId = window.setTimeout(() => {
      dispatch(clearStockVehicleMessages())
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dispatch, vehicleError, vehicleSuccess])

  useEffect(() => {
    if (!expensesError && !expensesSuccess) {
      return
    }

    const timerId = window.setTimeout(() => {
      dispatch(clearStockExpenseMessages())
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dispatch, expensesError, expensesSuccess])

  useEffect(() => {
    if (!fipeErrorMessage) {
      return
    }

    const timerId = window.setTimeout(() => {
      dispatch(clearError())
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dispatch, fipeErrorMessage])

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

  useEffect(() => {
    void dispatch(fetchStockVehicles())
    void dispatch(fetchSoldStockVehicles())
  }, [dispatch])

  const clearDependentFieldsFromType = () => {
    setBrandId('')
    setModelId('')
    setYearId('')
    dispatch(clearModelsAndBelow())
    setFipeDisplay('')
  }

  const clearDependentFieldsFromBrand = () => {
    setModelId('')
    setYearId('')
    dispatch(clearYearsAndPrice())
    setFipeDisplay('')
  }

  const clearDependentFieldsFromModel = () => {
    setYearId('')
    dispatch(clearPrice())
    setFipeDisplay('')
  }

  useEffect(() => {
    void dispatch(fetchBrands(vehicleType))
  }, [dispatch, vehicleType])

  useEffect(() => {
    if (!brandId) {
      return
    }

    void dispatch(fetchModels({ vehicleType, brandId }))
  }, [dispatch, vehicleType, brandId])

  useEffect(() => {
    if (!brandId || !modelId) {
      return
    }

    void dispatch(fetchYears({ vehicleType, brandId, modelId }))
  }, [dispatch, vehicleType, brandId, modelId])

  useEffect(() => {
    if (!brandId || !modelId || !yearId) {
      return
    }

    void dispatch(fetchPrice({ vehicleType, brandId, modelId, yearId }))
  }, [dispatch, vehicleType, brandId, modelId, yearId])

  useEffect(() => {
    const priceText = priceData?.price

    if (!priceText) {
      setFipeDisplay('')
      return
    }

    const parsedPrice = parseApiPriceToNumber(priceText)
    setFipeDisplay(parsedPrice > 0 ? formatCurrencyDisplay(parsedPrice) : '')
  }, [priceData?.price])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setVehicleDetailsForm(EMPTY_VEHICLE_DETAILS_FORM)
    dispatch(clearStockVehicleMessages())
    dispatch(clearStockExpenseMessages())
  }

  const handleOpenDetails = async (vehicleId: number) => {
    setIsDetailsModalOpen(true)
    setVehicleDetailsForm(EMPTY_VEHICLE_DETAILS_FORM)

    try {
      const vehicle = await dispatch(fetchStockVehicleById(vehicleId)).unwrap()
      setVehicleDetailsForm(mapVehicleToDetailsForm(vehicle))
    } catch {
      // The reducer stores the error state.
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
      dispatch(setStockVehicleError('Preencha todos os campos corretamente para atualizar o veiculo.'))
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

    try {
      const updatedVehicle = await dispatch(
        updateStockVehicle({ id: selectedVehicleDetails.id, payload }),
      ).unwrap()
      setVehicleDetailsForm(mapVehicleToDetailsForm(updatedVehicle))
      openApiResponseDialog('Atualizacao concluida', 'Veiculo atualizado com sucesso.', 'success')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Nao foi possivel atualizar o veiculo.'
      openApiResponseDialog('Falha na atualizacao', errorMessage, 'error')
    }
  }

  const handleDeleteVehicleDetails = async () => {
    if (!selectedVehicleDetails) {
      return
    }

    try {
      await dispatch(deleteStockVehicle(selectedVehicleDetails.id)).unwrap()
      handleCloseDetailsModal()
      openApiResponseDialog('Exclusao concluida', 'Veiculo excluido com sucesso.', 'success')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Nao foi possivel excluir o veiculo.'
      openApiResponseDialog('Falha na exclusao', errorMessage, 'error')
    }
  }

  const handleSellVehicleDetails = async (payload: {
    valorVendido: number
    dataVenda: string
    nomeComprador: string
    documentoComprador: string
    telefoneComprador: string
    nomeVendedor: string
  }) => {
    if (!selectedVehicleDetails) {
      return
    }

    if (
      !Number.isFinite(payload.valorVendido) ||
      payload.valorVendido <= 0 ||
      !payload.dataVenda ||
      !payload.nomeComprador ||
      !payload.documentoComprador ||
      !payload.telefoneComprador ||
      !payload.nomeVendedor
    ) {
      dispatch(setStockVehicleError('Preencha corretamente todos os dados da venda.'))
      return
    }

    try {
      await dispatch(sellStockVehicle({ id: selectedVehicleDetails.id, payload })).unwrap()
      handleCloseDetailsModal()
      openApiResponseDialog('Venda concluida', 'Veiculo marcado como vendido com sucesso.', 'success')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Nao foi possivel concluir a venda. Tente novamente.'
      openApiResponseDialog('Falha na venda', errorMessage, 'error')
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

    try {
      const createdVehicle = await dispatch(createStockVehicle(payload)).unwrap()

      handleCloseModal()
      openApiResponseDialog('Cadastro concluido', 'Veiculo cadastrado com sucesso.', 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nao foi possivel salvar o veiculo.'
      openApiResponseDialog('Falha no cadastro', errorMessage, 'error')
    }
  }

  return (
    <Stack spacing={3}>
      <GradientHeroCard
        chip={
          <Chip
            icon={<Inventory2RoundedIcon />}
            label="Gestão de estoque e vendas"
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
            Estoque, venda e{' '}
            <Box component="span" sx={{ color: '#38bdf8' }}>
              resultado por veículo
            </Box>
          </Typography>
        }
        description={
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.75, lineHeight: 1.6 }}>
            Cadastre, acompanhe gastos, registre vendas e compare custo total com lucro em um só lugar.
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
            Cadastrar veículo
          </Button>
        }
      />

      <StockVehiclesTable
        rows={stockCars}
        loading={loadingVehicles}
        errorMessage={vehiclesError}
        onOpenDetails={(vehicleId) => {
          void handleOpenDetails(vehicleId)
        }}
      />

      <StockVehiclesTable
        rows={soldStockCars}
        loading={loadingSoldVehicles}
        errorMessage={soldVehiclesError}
        title="Veículos vendidos e resultado"
        loadingLabel="Carregando vendidos, custo total e lucro..."
        emptyLabel="Nenhum veículo vendido até o momento para análise de resultado."
        showSaleData
        onOpenDetails={(vehicleId) => {
          void handleOpenDetails(vehicleId)
        }}
      />

      <AddVehicleDialog
        open={isModalOpen}
        onClose={handleCloseModal}
        onClearSubmitError={() => {
          setSubmitError('')
        }}
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
        submitError={submitError || vehicleError}
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
        loadingVehicleDetails={loadingVehicle}
        updatingVehicleDetails={updatingVehicle}
        deletingVehicleDetails={deletingVehicle}
        sellingVehicleDetails={sellingVehicle}
        vehicleDetailsError={vehicleError}
        vehicleDetailsSuccess={vehicleSuccess}
        selectedVehicleDetails={selectedVehicleDetails}
        vehicleDetailsForm={vehicleDetailsForm}
        setVehicleDetailsForm={setVehicleDetailsForm}
        onDelete={() => {
          void handleDeleteVehicleDetails()
        }}
        onUpdate={() => {
          void handleUpdateVehicleDetails()
        }}
        onSell={(payload) => {
          void handleSellVehicleDetails(payload)
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