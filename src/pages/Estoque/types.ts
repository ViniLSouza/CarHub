export type VehicleDetailsForm = {
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

export const EMPTY_VEHICLE_DETAILS_FORM: VehicleDetailsForm = {
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