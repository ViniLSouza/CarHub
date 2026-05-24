export type VehicleType = 'carros' | 'motos' | 'caminhoes'

export type ApiOption = {
  id?: string | number
  code?: string | number
  name?: string
  nome?: string
}

export type PriceResult = {
  vehicleType?: number | string
  brand?: string
  model?: string
  modelYear?: number | string
  year?: string
  fuel?: string
  codeFipe?: string
  price?: string
  reference?: string
  referenceMonth?: string
  fuelAcronym?: string
  [key: string]: unknown
}

const API_BASE = import.meta.env.VITE_FIPE_API_URL ?? 'http://localhost:3000'

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`Falha na requisicao: ${response.status}`)
  }

  return (await response.json()) as T
}

export function getOptionId(option: ApiOption): string {
  return String(option.code ?? option.id ?? '')
}

export function getOptionName(option: ApiOption): string {
  return option.name ?? option.nome ?? 'Sem nome'
}

export async function fetchBrandsApi(vehicleType: VehicleType): Promise<ApiOption[]> {
  const data = await requestJson<ApiOption[]>(`/${vehicleType}/marcas`)
  return Array.isArray(data) ? data : []
}

export async function fetchModelsApi(
  vehicleType: VehicleType,
  brandId: string,
): Promise<ApiOption[]> {
  const data = await requestJson<ApiOption[] | { models?: ApiOption[] }>(
    `/${vehicleType}/marcas/${brandId}/modelos`,
  )

  return Array.isArray(data) ? data : data.models ?? []
}

export async function fetchYearsApi(
  vehicleType: VehicleType,
  brandId: string,
  modelId: string,
): Promise<ApiOption[]> {
  const data = await requestJson<ApiOption[]>(`/${vehicleType}/marcas/${brandId}/modelos/${modelId}/anos`)
  return Array.isArray(data) ? data : []
}

export async function fetchPriceApi(
  vehicleType: VehicleType,
  brandId: string,
  modelId: string,
  yearId: string,
): Promise<PriceResult> {
  return requestJson<PriceResult>(`/${vehicleType}/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`)
}
