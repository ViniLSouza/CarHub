import type { VehicleType } from '../../api/fipeApi'

export const vehicleTypeOptions: Array<{ value: VehicleType; label: string }> = [
  { value: 'carros', label: 'Carros' },
  { value: 'motos', label: 'Motos' },
  { value: 'caminhoes', label: 'Caminhoes' },
]

export const fuelOptions = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol', label: 'Etanol' },
  { value: 'flex', label: 'Flex' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Eletrico' },
  { value: 'hibrido', label: 'Hibrido' },
]

export const transmissionOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automatico' },
  { value: 'cvt', label: 'CVT' },
  { value: 'automatizado', label: 'Automatizado' },
]

export const doorOptions = [
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]