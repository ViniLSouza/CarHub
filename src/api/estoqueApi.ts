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
}

export async function fetchVehiclesApi(): Promise<StockVehicle[]> {
  const data = await requestJson<StockVehicle[]>('/estoque/veiculos')
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
