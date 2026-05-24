export { store } from './store'
export type { AppDispatch, RootState } from './store'
export { useAppDispatch, useAppSelector } from './hooks'
export {
	clearError,
	clearModelsAndBelow,
	clearPrice,
	clearYearsAndPrice,
	fetchBrands,
	fetchModels,
	fetchPrice,
	fetchYears,
} from './slices/fipeSlice'
export { setLoading, toggleLoading } from './slices/uiSlice'
