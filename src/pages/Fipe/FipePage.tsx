import { Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { getOptionId, getOptionName, type VehicleType } from '../../api/fipeApi'
import {
  FipeFeedback,
  FipeFiltersCard,
  FipeHeader,
  FipeResultCard,
} from './components'
import {
  clearError,
  clearModelsAndBelow,
  clearPrice,
  clearYearsAndPrice,
  fetchBrands,
  fetchModels,
  fetchPrice,
  fetchYears,
  useAppDispatch,
  useAppSelector,
} from '../../store'

export function FipePage() {
  const dispatch = useAppDispatch()

  const [vehicleType, setVehicleType] = useState<VehicleType>('carros')
  const [brandId, setBrandId] = useState('')
  const [modelId, setModelId] = useState('')
  const [yearId, setYearId] = useState('')

  const {
    brands,
    models,
    years,
    priceData,
    loadingBrands,
    loadingModels,
    loadingYears,
    loadingPrice,
    errorMessage,
  } = useAppSelector((state) => state.fipe)

  const isLoadingAny = loadingBrands || loadingModels || loadingYears || loadingPrice

  const selectedBrandName = useMemo(() => {
    const found = brands.find((item) => getOptionId(item) === brandId)
    return found ? getOptionName(found) : '-'
  }, [brands, brandId])

  const selectedModelName = useMemo(() => {
    const found = models.find((item) => getOptionId(item) === modelId)
    return found ? getOptionName(found) : '-'
  }, [models, modelId])

  useEffect(() => {
    dispatch(fetchBrands(vehicleType))
  }, [dispatch, vehicleType])

  useEffect(() => {
    if (!brandId) {
      return
    }

    dispatch(fetchModels({ vehicleType, brandId }))
  }, [dispatch, vehicleType, brandId])

  useEffect(() => {
    if (!brandId || !modelId) {
      return
    }

    dispatch(fetchYears({ vehicleType, brandId, modelId }))
  }, [dispatch, vehicleType, brandId, modelId])

  useEffect(() => {
    if (!brandId || !modelId || !yearId) {
      return
    }

    dispatch(fetchPrice({ vehicleType, brandId, modelId, yearId }))
  }, [dispatch, vehicleType, brandId, modelId, yearId])

  const handleVehicleTypeChange = (nextVehicleType: VehicleType) => {
    dispatch(clearError())
    dispatch(clearModelsAndBelow())
    setBrandId('')
    setModelId('')
    setYearId('')
    setVehicleType(nextVehicleType)
  }

  const handleBrandChange = (value: string) => {
    dispatch(clearError())
    dispatch(clearYearsAndPrice())
    setModelId('')
    setYearId('')
    setBrandId(value)
  }

  const handleModelChange = (value: string) => {
    dispatch(clearError())
    dispatch(clearPrice())
    setYearId('')
    setModelId(value)
  }

  const handleYearChange = (value: string) => {
    dispatch(clearError())
    setYearId(value)
  }

  return (
    <Stack spacing={3}>
      <FipeHeader />

      <FipeFiltersCard
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
        onVehicleTypeChange={handleVehicleTypeChange}
        onBrandChange={handleBrandChange}
        onModelChange={handleModelChange}
        onYearChange={handleYearChange}
      >
        <FipeFeedback isLoadingAny={isLoadingAny} errorMessage={errorMessage} />
      </FipeFiltersCard>

      {priceData && (
        <FipeResultCard
          priceData={priceData}
          selectedBrandName={selectedBrandName}
          selectedModelName={selectedModelName}
          yearId={yearId}
        />
      )}
    </Stack>
  )
}
