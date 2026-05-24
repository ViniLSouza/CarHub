import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchBrandsApi,
  fetchModelsApi,
  fetchPriceApi,
  fetchYearsApi,
  type ApiOption,
  type PriceResult,
  type VehicleType,
} from '../../api/fipeApi'
import type { RootState } from '../store'

interface FipeState {
  brands: ApiOption[]
  models: ApiOption[]
  years: ApiOption[]
  priceData: PriceResult | null
  loadingBrands: boolean
  loadingModels: boolean
  loadingYears: boolean
  loadingPrice: boolean
  errorMessage: string
}

const initialState: FipeState = {
  brands: [],
  models: [],
  years: [],
  priceData: null,
  loadingBrands: false,
  loadingModels: false,
  loadingYears: false,
  loadingPrice: false,
  errorMessage: '',
}

export const fetchBrands = createAsyncThunk(
  'fipe/fetchBrands',
  async (vehicleType: VehicleType) => {
    return fetchBrandsApi(vehicleType)
  },
  {
    condition: (_vehicleType, { getState }) => {
      const { loadingBrands } = (getState() as RootState).fipe
      return !loadingBrands
    },
  },
)

export const fetchModels = createAsyncThunk(
  'fipe/fetchModels',
  async ({ vehicleType, brandId }: { vehicleType: VehicleType; brandId: string }) => {
    return fetchModelsApi(vehicleType, brandId)
  },
)

export const fetchYears = createAsyncThunk(
  'fipe/fetchYears',
  async ({
    vehicleType,
    brandId,
    modelId,
  }: {
    vehicleType: VehicleType
    brandId: string
    modelId: string
  }) => {
    return fetchYearsApi(vehicleType, brandId, modelId)
  },
)

export const fetchPrice = createAsyncThunk(
  'fipe/fetchPrice',
  async ({
    vehicleType,
    brandId,
    modelId,
    yearId,
  }: {
    vehicleType: VehicleType
    brandId: string
    modelId: string
    yearId: string
  }) => {
    return fetchPriceApi(vehicleType, brandId, modelId, yearId)
  },
)

const fipeSlice = createSlice({
  name: 'fipe',
  initialState,
  reducers: {
    clearModelsAndBelow: (state) => {
      state.models = []
      state.years = []
      state.priceData = null
    },
    clearYearsAndPrice: (state) => {
      state.years = []
      state.priceData = null
    },
    clearPrice: (state) => {
      state.priceData = null
    },
    clearError: (state) => {
      state.errorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loadingBrands = true
        state.errorMessage = ''
        state.brands = []
        state.models = []
        state.years = []
        state.priceData = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loadingBrands = false
        state.brands = action.payload
      })
      .addCase(fetchBrands.rejected, (state) => {
        state.loadingBrands = false
        state.errorMessage = 'Nao foi possivel carregar as marcas. Verifique sua API local.'
      })
      .addCase(fetchModels.pending, (state) => {
        state.loadingModels = true
        state.errorMessage = ''
        state.models = []
        state.years = []
        state.priceData = null
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loadingModels = false
        state.models = action.payload
      })
      .addCase(fetchModels.rejected, (state) => {
        state.loadingModels = false
        state.errorMessage = 'Nao foi possivel carregar os modelos da marca selecionada.'
      })
      .addCase(fetchYears.pending, (state) => {
        state.loadingYears = true
        state.errorMessage = ''
        state.years = []
        state.priceData = null
      })
      .addCase(fetchYears.fulfilled, (state, action) => {
        state.loadingYears = false
        state.years = action.payload
      })
      .addCase(fetchYears.rejected, (state) => {
        state.loadingYears = false
        state.errorMessage = 'Nao foi possivel carregar os anos desse modelo.'
      })
      .addCase(fetchPrice.pending, (state) => {
        state.loadingPrice = true
        state.errorMessage = ''
        state.priceData = null
      })
      .addCase(fetchPrice.fulfilled, (state, action) => {
        state.loadingPrice = false
        state.priceData = action.payload
      })
      .addCase(fetchPrice.rejected, (state) => {
        state.loadingPrice = false
        state.errorMessage = 'Nao foi possivel carregar os dados finais do veiculo.'
      })
  },
})

export const { clearModelsAndBelow, clearYearsAndPrice, clearPrice, clearError } = fipeSlice.actions
export default fipeSlice.reducer
