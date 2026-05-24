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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
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
import { vehicleTypeOptions } from '../Fipe/constants'

type StockCar = {
  id: number
  brand: string
  model: string
  year: number
}

type AddCarFormPayload = {
  type: VehicleType
  brandId: string
  modelId: string
  yearId: string
  fipe: number
  paidValue: number
  purchaseDate: string
}

const INITIAL_STOCK_CARS: StockCar[] = [
  { id: 1, brand: 'Toyota', model: 'Corolla XEi', year: 2022 },
  { id: 2, brand: 'Honda', model: 'Civic Touring', year: 2021 },
  { id: 3, brand: 'Volkswagen', model: 'T-Cross Comfortline', year: 2023 },
  { id: 4, brand: 'Chevrolet', model: 'Onix LT', year: 2020 },
  { id: 5, brand: 'Hyundai', model: 'HB20 Platinum', year: 2024 },
]

function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace('R$\u00a0', 'R$')
}

function toCurrencyDisplayFromInput(rawInput: string): string {
  const digits = rawInput.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const value = Number(digits) / 100
  return formatCurrencyDisplay(value)
}

function parseDisplayCurrencyToNumber(value: string): number {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 0
  }

  return Number(digits) / 100
}

function parseApiPriceToNumber(price: string | undefined): number {
  if (!price) {
    return 0
  }

  const normalized = price.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const numeric = Number(normalized.replace(/[^\d.\-]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function formatDateDisplay(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const part1 = digits.slice(0, 2)
  const part2 = digits.slice(2, 4)
  const part3 = digits.slice(4, 8)

  if (digits.length <= 2) {
    return part1
  }

  if (digits.length <= 4) {
    return `${part1}/${part2}`
  }

  return `${part1}/${part2}/${part3}`
}

function toIsoDate(displayDate: string): string {
  const [day, month, year] = displayDate.split('/')

  if (!day || !month || !year || year.length !== 4) {
    return ''
  }

  return `${year}-${month}-${day}`
}

function getYearFromYearId(yearId: string): number {
  const digits = yearId.match(/^\d{4}/)?.[0]
  return digits ? Number(digits) : new Date().getFullYear()
}

export function EstoquePage() {
  const [stockCars, setStockCars] = useState<StockCar[]>(INITIAL_STOCK_CARS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicleType, setVehicleType] = useState<VehicleType>('carros')
  const [brandId, setBrandId] = useState('')
  const [modelId, setModelId] = useState('')
  const [yearId, setYearId] = useState('')
  const [fipeDisplay, setFipeDisplay] = useState('')
  const [paidValueDisplay, setPaidValueDisplay] = useState('')
  const [purchaseDateDisplay, setPurchaseDateDisplay] = useState('')
  const [brands, setBrands] = useState<ApiOption[]>([])
  const [models, setModels] = useState<ApiOption[]>([])
  const [years, setYears] = useState<ApiOption[]>([])
  const [loadingBrands, setLoadingBrands] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const selectedBrandName = useMemo(
    () => brands.find((item) => getOptionId(item) === brandId)?.name ?? '-',
    [brands, brandId],
  )

  const selectedModelName = useMemo(
    () => models.find((item) => getOptionId(item) === modelId)?.name ?? '-',
    [models, modelId],
  )

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
    setModels([])
    setYears([])
  }

  const handleSubmit = () => {
    const fipeValue = parseDisplayCurrencyToNumber(fipeDisplay)
    const paidValue = parseDisplayCurrencyToNumber(paidValueDisplay)
    const purchaseDate = toIsoDate(purchaseDateDisplay)

    if (!brandId || !modelId || !yearId || !fipeValue || !paidValue || !purchaseDate) {
      setSubmitError('Preencha todos os campos obrigatorios para salvar o carro.')
      return
    }

    const payload: AddCarFormPayload = {
      type: vehicleType,
      brandId,
      modelId,
      yearId,
      fipe: fipeValue,
      paidValue,
      purchaseDate,
    }

    setStockCars((prev) => [
      {
        id: Date.now(),
        brand: selectedBrandName,
        model: selectedModelName,
        year: getYearFromYearId(yearId),
      },
      ...prev,
    ])

    console.info('Payload normalizado para envio:', payload)
    handleCloseModal()
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

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'rgba(20, 40, 80, 0.10)',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table aria-label="Tabela de carros em estoque">
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: 'rgba(29, 79, 145, 0.06)',
                  '& .MuiTableCell-root': {
                    color: '#1a355a',
                    fontWeight: 700,
                    borderBottomColor: 'rgba(20, 40, 80, 0.12)',
                  },
                }}
              >
                <TableCell>Marca</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell align="right">Ano</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stockCars.map((car) => (
                <TableRow
                  key={car.id}
                  hover
                  sx={{
                    '& .MuiTableCell-root': { borderBottomColor: 'rgba(20, 40, 80, 0.10)' },
                  }}
                >
                  <TableCell sx={{ color: '#1f2f4a', fontWeight: 600 }}>{car.brand}</TableCell>
                  <TableCell sx={{ color: '#3d4f6c' }}>{car.model}</TableCell>
                  <TableCell align="right" sx={{ color: '#1f2f4a', fontWeight: 600 }}>
                    {car.year}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        aria-labelledby="add-car-dialog-title"
      >
        <DialogTitle id="add-car-dialog-title" sx={{ fontWeight: 700 }}>
          Adicionar carro ao estoque
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="stock-vehicle-type-label">Tipo</InputLabel>
              <Select
                labelId="stock-vehicle-type-label"
                label="Tipo"
                value={vehicleType}
                onChange={(event) => {
                  setVehicleType(event.target.value as VehicleType)
                  clearDependentFieldsFromType()
                }}
              >
                {vehicleTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!brands.length || loadingBrands}>
              <InputLabel id="stock-brand-label">Marca</InputLabel>
              <Select
                labelId="stock-brand-label"
                label="Marca"
                value={brandId}
                onChange={(event) => {
                  setBrandId(event.target.value)
                  clearDependentFieldsFromBrand()
                }}
              >
                {brands.map((brand) => (
                  <MenuItem key={getOptionId(brand)} value={getOptionId(brand)}>
                    {getOptionName(brand)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!brandId || !models.length || loadingModels}>
              <InputLabel id="stock-model-label">Modelo</InputLabel>
              <Select
                labelId="stock-model-label"
                label="Modelo"
                value={modelId}
                onChange={(event) => {
                  setModelId(event.target.value)
                  clearDependentFieldsFromModel()
                }}
              >
                {models.map((model) => (
                  <MenuItem key={getOptionId(model)} value={getOptionId(model)}>
                    {getOptionName(model)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!modelId || !years.length || loadingYears}>
              <InputLabel id="stock-year-label">Ano</InputLabel>
              <Select
                labelId="stock-year-label"
                label="Ano"
                value={yearId}
                onChange={(event) => setYearId(event.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={getOptionId(year)} value={getOptionId(year)}>
                    {getOptionName(year)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
            onClick={handleSubmit}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#1d4f91' }}
          >
            Salvar carro
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}