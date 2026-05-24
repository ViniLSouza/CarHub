import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createVehicleApi,
  createVehicleExpenseApi,
  deleteVehicleApi,
  deleteVehicleExpenseApi,
  fetchVehicleByIdApi,
  fetchVehicleExpensesApi,
  fetchSoldVehiclesApi,
  fetchVehiclesApi,
  sellVehicleApi,
  updateVehicleApi,
  updateVehicleExpenseApi,
  type CreateVehiclePayload,
  type SellVehiclePayload,
  type StockVehicle,
  type VehicleExpense,
} from '../../api/estoqueApi'

type StockState = {
  vehicles: StockVehicle[]
  soldVehicles: StockVehicle[]
  selectedVehicle: StockVehicle | null
  expenses: VehicleExpense[]
  loadingVehicles: boolean
  loadingSoldVehicles: boolean
  loadingVehicle: boolean
  loadingExpenses: boolean
  savingVehicle: boolean
  updatingVehicle: boolean
  deletingVehicle: boolean
  sellingVehicle: boolean
  savingExpense: boolean
  updatingExpense: boolean
  deletingExpense: boolean
  vehiclesError: string
  soldVehiclesError: string
  vehicleError: string
  vehicleSuccess: string
  expensesError: string
  expensesSuccess: string
}

const initialState: StockState = {
  vehicles: [] as StockVehicle[],
  soldVehicles: [] as StockVehicle[],
  selectedVehicle: null,
  expenses: [],
  loadingVehicles: false,
  loadingSoldVehicles: false,
  loadingVehicle: false,
  loadingExpenses: false,
  savingVehicle: false,
  updatingVehicle: false,
  deletingVehicle: false,
  sellingVehicle: false,
  savingExpense: false,
  updatingExpense: false,
  deletingExpense: false,
  vehiclesError: '',
  soldVehiclesError: '',
  vehicleError: '',
  vehicleSuccess: '',
  expensesError: '',
  expensesSuccess: '',
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export const fetchStockVehicles = createAsyncThunk('stock/fetchVehicles', async () => {
  return fetchVehiclesApi()
})

export const fetchSoldStockVehicles = createAsyncThunk('stock/fetchSoldVehicles', async () => {
  return fetchSoldVehiclesApi()
})

export const fetchStockVehicleById = createAsyncThunk('stock/fetchVehicleById', async (id: number) => {
  return fetchVehicleByIdApi(id)
})

export const createStockVehicle = createAsyncThunk(
  'stock/createVehicle',
  async (payload: CreateVehiclePayload) => {
    return createVehicleApi(payload)
  },
)

export const updateStockVehicle = createAsyncThunk(
  'stock/updateVehicle',
  async ({ id, payload }: { id: number; payload: CreateVehiclePayload }) => {
    return updateVehicleApi(id, payload)
  },
)

export const deleteStockVehicle = createAsyncThunk('stock/deleteVehicle', async (id: number) => {
  await deleteVehicleApi(id)
  return id
})

export const sellStockVehicle = createAsyncThunk(
  'stock/sellVehicle',
  async ({ id, payload }: { id: number; payload: SellVehiclePayload }) => {
    return sellVehicleApi(id, payload)
  },
)

export const fetchStockVehicleExpenses = createAsyncThunk(
  'stock/fetchExpenses',
  async (vehicleId: number) => {
    return fetchVehicleExpensesApi(vehicleId)
  },
)

export const createStockVehicleExpense = createAsyncThunk(
  'stock/createExpense',
  async ({
    vehicleId,
    payload,
  }: {
    vehicleId: number
    payload: { tipo: string; descricao: string; valor: number }
  }) => {
    return createVehicleExpenseApi(vehicleId, payload)
  },
)

export const updateStockVehicleExpense = createAsyncThunk(
  'stock/updateExpense',
  async ({
    vehicleId,
    expenseId,
    payload,
  }: {
    vehicleId: number
    expenseId: string
    payload: { tipo: string; descricao: string; valor: number }
  }) => {
    return updateVehicleExpenseApi(vehicleId, expenseId, payload)
  },
)

export const deleteStockVehicleExpense = createAsyncThunk(
  'stock/deleteExpense',
  async ({ vehicleId, expenseId }: { vehicleId: number; expenseId: string }) => {
    return deleteVehicleExpenseApi(vehicleId, expenseId)
  },
)

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    clearStockVehicleMessages: (state) => {
      state.vehicleError = ''
      state.vehicleSuccess = ''
    },
    setStockVehicleError: (state, action: { payload: string }) => {
      state.vehicleError = action.payload
      state.vehicleSuccess = ''
    },
    setStockVehicleSuccess: (state, action: { payload: string }) => {
      state.vehicleSuccess = action.payload
      state.vehicleError = ''
    },
    clearStockVehiclesError: (state) => {
      state.vehiclesError = ''
    },
    clearSoldStockVehiclesError: (state) => {
      state.soldVehiclesError = ''
    },
    clearStockExpenseMessages: (state) => {
      state.expensesError = ''
      state.expensesSuccess = ''
    },
    setStockExpenseError: (state, action: { payload: string }) => {
      state.expensesError = action.payload
      state.expensesSuccess = ''
    },
    setStockExpenseSuccess: (state, action: { payload: string }) => {
      state.expensesSuccess = action.payload
      state.expensesError = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockVehicles.pending, (state) => {
        state.loadingVehicles = true
        state.vehiclesError = ''
      })
      .addCase(fetchStockVehicles.fulfilled, (state, action) => {
        state.loadingVehicles = false
        state.vehicles = action.payload
      })
      .addCase(fetchStockVehicles.rejected, (state, action) => {
        state.loadingVehicles = false
        state.vehiclesError = getErrorMessage(action.error.message, 'Nao foi possivel carregar os veiculos cadastrados no estoque.')
      })
      .addCase(fetchSoldStockVehicles.pending, (state) => {
        state.loadingSoldVehicles = true
        state.soldVehiclesError = ''
      })
      .addCase(fetchSoldStockVehicles.fulfilled, (state, action) => {
        state.loadingSoldVehicles = false
        state.soldVehicles = action.payload
      })
      .addCase(fetchSoldStockVehicles.rejected, (state, action) => {
        state.loadingSoldVehicles = false
        state.soldVehiclesError = getErrorMessage(action.error.message, 'Nao foi possivel carregar os veiculos vendidos.')
      })
      .addCase(fetchStockVehicleById.pending, (state) => {
        state.loadingVehicle = true
        state.vehicleError = ''
        state.vehicleSuccess = ''
        state.selectedVehicle = null
      })
      .addCase(fetchStockVehicleById.fulfilled, (state, action) => {
        state.loadingVehicle = false
        state.selectedVehicle = action.payload
      })
      .addCase(fetchStockVehicleById.rejected, (state, action) => {
        state.loadingVehicle = false
        state.vehicleError = getErrorMessage(action.error.message, 'Nao foi possivel carregar os detalhes do veiculo.')
      })
      .addCase(createStockVehicle.pending, (state) => {
        state.savingVehicle = true
        state.vehicleError = ''
        state.vehicleSuccess = ''
      })
      .addCase(createStockVehicle.fulfilled, (state, action) => {
        state.savingVehicle = false
        state.vehicles = [action.payload, ...state.vehicles]
        state.vehicleSuccess = 'Veiculo cadastrado com sucesso.'
      })
      .addCase(createStockVehicle.rejected, (state, action) => {
        state.savingVehicle = false
        state.vehicleError = getErrorMessage(action.error.message, 'Nao foi possivel salvar o veiculo.')
      })
      .addCase(updateStockVehicle.pending, (state) => {
        state.updatingVehicle = true
        state.vehicleError = ''
        state.vehicleSuccess = ''
      })
      .addCase(updateStockVehicle.fulfilled, (state, action) => {
        state.updatingVehicle = false
        state.selectedVehicle = action.payload
        state.vehicles = state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? action.payload : vehicle,
        )
        state.soldVehicles = state.soldVehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? action.payload : vehicle,
        )
        state.vehicleSuccess = 'Veiculo atualizado com sucesso.'
      })
      .addCase(updateStockVehicle.rejected, (state, action) => {
        state.updatingVehicle = false
        state.vehicleError = getErrorMessage(action.error.message, 'Nao foi possivel atualizar o veiculo.')
      })
      .addCase(deleteStockVehicle.pending, (state) => {
        state.deletingVehicle = true
        state.vehicleError = ''
        state.vehicleSuccess = ''
      })
      .addCase(deleteStockVehicle.fulfilled, (state, action) => {
        state.deletingVehicle = false
        state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload)
        state.soldVehicles = state.soldVehicles.filter((vehicle) => vehicle.id !== action.payload)
        state.selectedVehicle = null
        state.expenses = []
        state.vehicleSuccess = 'Veiculo excluido com sucesso.'
      })
      .addCase(deleteStockVehicle.rejected, (state, action) => {
        state.deletingVehicle = false
        state.vehicleError = getErrorMessage(action.error.message, 'Nao foi possivel excluir o veiculo.')
      })
      .addCase(sellStockVehicle.pending, (state) => {
        state.sellingVehicle = true
        state.vehicleError = ''
        state.vehicleSuccess = ''
      })
      .addCase(sellStockVehicle.fulfilled, (state, action) => {
        state.sellingVehicle = false
        state.selectedVehicle = action.payload
        state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload.id)
        state.soldVehicles = [action.payload, ...state.soldVehicles.filter((vehicle) => vehicle.id !== action.payload.id)]
        state.vehicleSuccess = 'Veiculo marcado como vendido com sucesso.'
      })
      .addCase(sellStockVehicle.rejected, (state, action) => {
        state.sellingVehicle = false
        const errorMessage = String(action.error.message ?? '')

        if (errorMessage.includes('400')) {
          state.vehicleError = 'Preencha corretamente todos os dados da venda.'
          return
        }

        if (errorMessage.includes('404')) {
          state.vehicleError = 'Veiculo nao encontrado.'
          return
        }

        if (errorMessage.includes('409')) {
          state.vehicleError = 'Este veiculo ja foi marcado como vendido.'
          return
        }

        state.vehicleError = getErrorMessage(action.error.message, 'Nao foi possivel concluir a venda. Tente novamente.')
      })
      .addCase(fetchStockVehicleExpenses.pending, (state) => {
        state.loadingExpenses = true
        state.expensesError = ''
        state.expensesSuccess = ''
      })
      .addCase(fetchStockVehicleExpenses.fulfilled, (state, action) => {
        state.loadingExpenses = false
        state.expenses = action.payload
      })
      .addCase(fetchStockVehicleExpenses.rejected, (state, action) => {
        state.loadingExpenses = false
        state.expensesError = getErrorMessage(action.error.message, 'Nao foi possivel carregar os gastos deste veiculo.')
      })
      .addCase(createStockVehicleExpense.pending, (state) => {
        state.savingExpense = true
        state.expensesError = ''
        state.expensesSuccess = ''
      })
      .addCase(createStockVehicleExpense.fulfilled, (state, action) => {
        state.savingExpense = false
        state.expenses = action.payload
        state.expensesSuccess = 'Gasto cadastrado com sucesso.'
      })
      .addCase(createStockVehicleExpense.rejected, (state, action) => {
        state.savingExpense = false
        state.expensesError = getErrorMessage(action.error.message, 'Nao foi possivel cadastrar o gasto.')
      })
      .addCase(updateStockVehicleExpense.pending, (state) => {
        state.updatingExpense = true
        state.expensesError = ''
        state.expensesSuccess = ''
      })
      .addCase(updateStockVehicleExpense.fulfilled, (state, action) => {
        state.updatingExpense = false
        state.expenses = action.payload
        state.expensesSuccess = 'Gasto atualizado com sucesso.'
      })
      .addCase(updateStockVehicleExpense.rejected, (state, action) => {
        state.updatingExpense = false
        state.expensesError = getErrorMessage(action.error.message, 'Nao foi possivel atualizar o gasto.')
      })
      .addCase(deleteStockVehicleExpense.pending, (state) => {
        state.deletingExpense = true
        state.expensesError = ''
        state.expensesSuccess = ''
      })
      .addCase(deleteStockVehicleExpense.fulfilled, (state, action) => {
        state.deletingExpense = false
        state.expenses = action.payload
        state.expensesSuccess = 'Gasto excluido com sucesso.'
      })
      .addCase(deleteStockVehicleExpense.rejected, (state, action) => {
        state.deletingExpense = false
        state.expensesError = getErrorMessage(action.error.message, 'Nao foi possivel excluir o gasto selecionado.')
      })
  },
})

export const {
  clearStockExpenseMessages,
  clearSoldStockVehiclesError,
  clearStockVehicleMessages,
  clearStockVehiclesError,
  setStockExpenseError,
  setStockExpenseSuccess,
  setStockVehicleError,
  setStockVehicleSuccess,
} = stockSlice.actions

export default stockSlice.reducer