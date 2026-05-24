import type { VehicleType } from '../../api/fipeApi'

export const vehicleTypeOptions: Array<{ value: VehicleType; label: string }> = [
  { value: 'carros', label: 'Carros' },
  { value: 'motos', label: 'Motos' },
  { value: 'caminhoes', label: 'Caminhoes' },
]
