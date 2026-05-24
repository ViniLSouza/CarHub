import type { VehicleType } from './fipeApi'
import { requestJson } from './httpClient'

type BackendVehicleType = VehicleType | 'cars' | 'motorcycles' | 'trucks' | string

export type CreateVehiclePayload = {
  type: BackendVehicleType
  brand: string
  model: string
  year: string
  plate: string
  renavam: string
  color: string
  currentKm: number
  fuel: string
  transmission: string
  doors: number
  fipe: number
  paidValue: number
  purchaseDate: string
}

export type StockVehicle = {
  id: number
  type: string
  brand: string
  model: string
  year: string
  plate: string
  renavam: string
  color: string
  currentKm: number
  fuel: string
  transmission: string
  doors: number
  fipe: number
  paidValue: number
  purchaseDate: string
  sold?: boolean
  soldValue?: number
  totalCost?: number
  soldDate?: string
  buyerName?: string
  buyerDocument?: string
  buyerPhone?: string
  sellerName?: string
}

export type VehicleExpense = {
  id: string
  type: string
  description: string
  value: number
}

export type VehicleExpensePayload = {
  tipo: string
  descricao: string
  valor: number
}

export type SellVehiclePayload = {
  valorVendido: number
  dataVenda: string
  nomeComprador: string
  documentoComprador: string
  telefoneComprador: string
  nomeVendedor: string
}

export async function fetchVehiclesApi(): Promise<StockVehicle[]> {
  const data = await requestJson<StockVehicle[]>('/estoque/veiculos')
  return Array.isArray(data) ? data : []
}

export async function fetchSoldVehiclesApi(): Promise<StockVehicle[]> {
  const data = await requestJson<StockVehicle[]>('/estoque/veiculos/vendidos')
  return Array.isArray(data) ? data : []
}

export async function createVehicleApi(payload: CreateVehiclePayload): Promise<StockVehicle> {
  return requestJson<StockVehicle>('/estoque/veiculos', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchVehicleByIdApi(id: number): Promise<StockVehicle> {
  return requestJson<StockVehicle>(`/vehicles/${id}`)
}

export async function updateVehicleApi(id: number, payload: CreateVehiclePayload): Promise<StockVehicle> {
  return requestJson<StockVehicle>(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteVehicleApi(id: number): Promise<void> {
  await requestJson<unknown>(`/vehicles/${id}`, {
    method: 'DELETE',
  })
}

export async function sellVehicleApi(id: number, payload: SellVehiclePayload): Promise<StockVehicle> {
  return requestJson<StockVehicle>(`/vehicles/${id}/vender`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function fetchVehicleExpensesApi(vehicleId: number): Promise<VehicleExpense[]> {
  const data = await requestJson<VehicleExpense[]>(`/vehicles/${vehicleId}/gastos`)
  return Array.isArray(data) ? data : []
}

export async function createVehicleExpenseApi(
  vehicleId: number,
  payload: VehicleExpensePayload,
): Promise<VehicleExpense[]> {
  const data = await requestJson<VehicleExpense[]>(`/vehicles/${vehicleId}/gastos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return Array.isArray(data) ? data : []
}

export async function updateVehicleExpenseApi(
  vehicleId: number,
  expenseId: string,
  payload: VehicleExpensePayload,
): Promise<VehicleExpense[]> {
  const data = await requestJson<VehicleExpense[]>(`/vehicles/${vehicleId}/gastos/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  return Array.isArray(data) ? data : []
}

export async function deleteVehicleExpenseApi(vehicleId: number, expenseId: string): Promise<VehicleExpense[]> {
  const data = await requestJson<VehicleExpense[]>(`/vehicles/${vehicleId}/gastos/${expenseId}`, {
    method: 'DELETE',
  })

  return Array.isArray(data) ? data : []
}
