import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { StockVehicle, VehicleExpense } from '../../../api/estoqueApi'
import { DialogTitleWithIcon } from '../../../components/DialogTitleWithIcon'
import { FormSectionTitle } from '../../../components/FormSectionTitle'
import {
  formatCurrencyDisplay,
  formatDateDisplay,
  parseDisplayCurrencyToNumber,
  toDisplayDate,
  toCurrencyDisplayFromInput,
} from '../../../shared/utils/formatters'
import type { VehicleDetailsForm } from '../types'
import {
  createStockVehicleExpense,
  clearStockExpenseMessages,
  deleteStockVehicleExpense,
  fetchStockVehicleExpenses,
  setStockExpenseError,
  setStockVehicleError,
  updateStockVehicleExpense,
  useAppSelector,
  useAppDispatch,
} from '../../../store'

type ExpenseForm = {
  type: string
  description: string
  value: string
}

const EMPTY_EXPENSE_FORM: ExpenseForm = {
  type: '',
  description: '',
  value: '',
}

type SellForm = {
  soldValue: string
  soldDate: string
  buyerName: string
  buyerDocument: string
  buyerPhone: string
  sellerName: string
}

const EMPTY_SELL_FORM: SellForm = {
  soldValue: '',
  soldDate: '',
  buyerName: '',
  buyerDocument: '',
  buyerPhone: '',
  sellerName: '',
}

type VehicleDetailsDialogProps = {
  open: boolean
  onClose: () => void
  loadingVehicleDetails: boolean
  updatingVehicleDetails: boolean
  deletingVehicleDetails: boolean
  vehicleDetailsError: string
  vehicleDetailsSuccess: string
  selectedVehicleDetails: StockVehicle | null
  vehicleDetailsForm: VehicleDetailsForm
  setVehicleDetailsForm: Dispatch<SetStateAction<VehicleDetailsForm>>
  onDelete: () => void
  onUpdate: () => void
  onSell: (payload: {
    valorVendido: number
    dataVenda: string
    nomeComprador: string
    documentoComprador: string
    telefoneComprador: string
    nomeVendedor: string
  }) => void
  sellingVehicleDetails: boolean
}

export function VehicleDetailsDialog({
  open,
  onClose,
  loadingVehicleDetails,
  updatingVehicleDetails,
  deletingVehicleDetails,
  vehicleDetailsError,
  vehicleDetailsSuccess,
  selectedVehicleDetails,
  vehicleDetailsForm,
  setVehicleDetailsForm,
  onDelete,
  onUpdate,
  onSell,
  sellingVehicleDetails,
}: VehicleDetailsDialogProps) {
  const dispatch = useAppDispatch()
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(EMPTY_EXPENSE_FORM)
  const [sellForm, setSellForm] = useState<SellForm>(EMPTY_SELL_FORM)
  const [editingExpenseId, setEditingExpenseId] = useState('')
  const [expenseDeleteTarget, setExpenseDeleteTarget] = useState<VehicleExpense | null>(null)
  const {
    expenses,
    loadingExpenses,
    savingExpense,
    deletingExpense,
    expensesError,
    expensesSuccess,
  } = useAppSelector((state) => state.stock)
  const isDisabled = !selectedVehicleDetails || loadingVehicleDetails || updatingVehicleDetails || deletingVehicleDetails
  const isSoldVehicle = Boolean(selectedVehicleDetails?.sold)
  const isReadOnly = isDisabled || isSoldVehicle

  const resetExpenseForm = () => {
    setExpenseForm(EMPTY_EXPENSE_FORM)
    setEditingExpenseId('')
  }

  const resetExpenseSection = () => {
    resetExpenseForm()
    setExpenseDeleteTarget(null)
    dispatch(clearStockExpenseMessages())
  }

  useEffect(() => {
    if (!open) {
      setIsDeleteConfirmOpen(false)
      setIsSellDialogOpen(false)
      resetExpenseSection()
      return
    }

    if (!selectedVehicleDetails) {
      resetExpenseSection()
      return
    }

    void dispatch(fetchStockVehicleExpenses(selectedVehicleDetails.id))
  }, [dispatch, open, selectedVehicleDetails?.id])

  const handleRequestDelete = () => {
    setIsDeleteConfirmOpen(true)
  }

  const handleCloseDeleteConfirm = () => {
    if (deletingVehicleDetails) {
      return
    }

    setIsDeleteConfirmOpen(false)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setIsDeleteConfirmOpen(false)
  }

  const handleOpenSellDialog = () => {
    setIsSellDialogOpen(true)
  }

  const handleCloseSellDialog = () => {
    if (sellingVehicleDetails) {
      return
    }

    setIsSellDialogOpen(false)
    setSellForm(EMPTY_SELL_FORM)
  }

  useEffect(() => {
    if (!expensesError && !expensesSuccess) {
      return
    }

    const timerId = window.setTimeout(() => {
      dispatch(clearStockExpenseMessages())
    }, 3000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [dispatch, expensesError, expensesSuccess])

  const handleEditExpense = (expense: VehicleExpense) => {
    dispatch(clearStockExpenseMessages())
    setEditingExpenseId(expense.id)
    setExpenseForm({
      type: expense.type,
      description: expense.description,
      value: formatCurrencyDisplay(expense.value),
    })
  }

  const handleCancelExpenseEdit = () => {
    dispatch(clearStockExpenseMessages())
    resetExpenseForm()
  }

  const handleSaveExpense = async () => {
    if (!selectedVehicleDetails) {
      return
    }

    const value = parseDisplayCurrencyToNumber(expenseForm.value)

    if (!expenseForm.type.trim() || !expenseForm.description.trim() || !Number.isFinite(value) || value <= 0) {
      dispatch(setStockExpenseError('Preencha tipo, descricao e valor corretamente.'))
      return
    }

    try {
      const payload = {
        tipo: expenseForm.type.trim(),
        descricao: expenseForm.description.trim(),
        valor: value,
      }

      if (editingExpenseId) {
        await dispatch(
          updateStockVehicleExpense({
            vehicleId: selectedVehicleDetails.id,
            expenseId: editingExpenseId,
            payload,
          }),
        ).unwrap()
      } else {
        await dispatch(
          createStockVehicleExpense({
            vehicleId: selectedVehicleDetails.id,
            payload,
          }),
        ).unwrap()
      }

      resetExpenseForm()
    } catch {
      // Reducer keeps the failure state.
    }
  }

  const handleDeleteExpense = async () => {
    if (!selectedVehicleDetails || !expenseDeleteTarget) {
      return
    }

    try {
      await dispatch(
        deleteStockVehicleExpense({
          vehicleId: selectedVehicleDetails.id,
          expenseId: expenseDeleteTarget.id,
        }),
      ).unwrap()

      if (editingExpenseId === expenseDeleteTarget.id) {
        resetExpenseForm()
      }

      setExpenseDeleteTarget(null)
    } catch {
      // Reducer keeps the failure state.
    }
  }

  const handleConfirmSell = () => {
    const soldValue = parseDisplayCurrencyToNumber(sellForm.soldValue)

    if (
      !Number.isFinite(soldValue) ||
      soldValue <= 0 ||
      !sellForm.soldDate.trim() ||
      !sellForm.buyerName.trim() ||
      !sellForm.buyerDocument.trim() ||
      !sellForm.buyerPhone.trim() ||
      !sellForm.sellerName.trim()
    ) {
      dispatch(setStockVehicleError('Preencha corretamente todos os dados da venda.'))
      return
    }

    onSell({
      valorVendido: soldValue,
      dataVenda: sellForm.soldDate.trim(),
      nomeComprador: sellForm.buyerName.trim(),
      documentoComprador: sellForm.buyerDocument.trim(),
      telefoneComprador: sellForm.buyerPhone.trim(),
      nomeVendedor: sellForm.sellerName.trim(),
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="vehicle-details-dialog-title"
    >
      <DialogTitleWithIcon
        id="vehicle-details-dialog-title"
        icon={<DirectionsCarRoundedIcon />}
        title="Detalhes do veículo"
        subtitle={
          isSoldVehicle
            ? 'Consulte os dados da venda, custo total e lucro do veículo'
            : 'Visualize e edite as informações do veículo'
        }
      />

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          {loadingVehicleDetails && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Carregando detalhes do veículo...
              </Typography>
            </Stack>
          )}

          {vehicleDetailsError && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {vehicleDetailsError}
            </Alert>
          )}

          {vehicleDetailsSuccess && (
            <Alert severity="success" sx={{ borderRadius: 3 }}>
              {vehicleDetailsSuccess}
            </Alert>
          )}

          {!loadingVehicleDetails && isSoldVehicle && (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              Este veículo já foi vendido. Os dados estão disponíveis apenas para consulta e análise de resultado.
            </Alert>
          )}

          {!loadingVehicleDetails && selectedVehicleDetails && (
            <>
              {/* Vehicle identity */}
              <Box>
                <FormSectionTitle title="Identificação" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Marca" value={vehicleDetailsForm.brand} disabled fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Modelo" value={vehicleDetailsForm.model} disabled fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Ano" value={vehicleDetailsForm.year} disabled fullWidth />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Documents */}
              <Box>
                <FormSectionTitle title="Documentação" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Placa"
                      value={vehicleDetailsForm.plate}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, plate: event.target.value.toUpperCase() }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                      slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="RENAVAM"
                      value={vehicleDetailsForm.renavam}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          renavam: event.target.value.replace(/\D/g, '').slice(0, 11),
                        }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Expenses */}
              <Box>
                <FormSectionTitle title="Gastos do veículo" uppercase />

                <Stack spacing={2.25}>
                  {expensesError && (
                    <Alert severity="warning" sx={{ borderRadius: 3 }}>
                      {expensesError}
                    </Alert>
                  )}

                  {expensesSuccess && (
                    <Alert severity="success" sx={{ borderRadius: 3 }}>
                      {expensesSuccess}
                    </Alert>
                  )}

                  {loadingExpenses ? (
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 1 }}>
                      <CircularProgress size={18} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Carregando gastos do veículo...
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack spacing={1.5}>
                      {!isSoldVehicle && (
                        <>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 3 }}>
                              <TextField
                                label="Tipo"
                                value={expenseForm.type}
                                onChange={(event) => {
                                  setExpenseForm((prev) => ({ ...prev, type: event.target.value }))
                                }}
                                placeholder="Ex: mecanica"
                                fullWidth
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                label="Descrição"
                                value={expenseForm.description}
                                onChange={(event) => {
                                  setExpenseForm((prev) => ({ ...prev, description: event.target.value }))
                                }}
                                placeholder="Ex: troca de oleo e filtro"
                                fullWidth
                                multiline
                                minRows={1}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                              <TextField
                                label="Valor"
                                value={expenseForm.value}
                                onChange={(event) => {
                                  setExpenseForm((prev) => ({
                                    ...prev,
                                    value: toCurrencyDisplayFromInput(event.target.value),
                                  }))
                                }}
                                placeholder="R$ 0,00"
                                fullWidth
                              />
                            </Grid>
                          </Grid>

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ justifyContent: 'flex-end' }}>
                            {editingExpenseId && (
                              <Button
                                variant="text"
                                color="inherit"
                                onClick={handleCancelExpenseEdit}
                                disabled={savingExpense || deletingExpense}
                                sx={{ fontWeight: 600 }}
                              >
                                Cancelar edição
                              </Button>
                            )}
                            <Button
                              variant="contained"
                              onClick={handleSaveExpense}
                              disabled={savingExpense || deletingExpense}
                              startIcon={editingExpenseId ? <SaveRoundedIcon /> : <AddCircleOutlineRoundedIcon />}
                              sx={{ fontWeight: 700, minWidth: { sm: 220 } }}
                            >
                              {savingExpense ? 'Salvando...' : editingExpenseId ? 'Atualizar gasto' : 'Adicionar gasto'}
                            </Button>
                          </Stack>
                        </>
                      )}

                      <Stack spacing={1.25}>
                        {expenses.length ? (
                          expenses.map((expense) => (
                            <Paper
                              key={expense.id}
                              variant="outlined"
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                borderColor: 'rgba(20,40,80,0.10)',
                                bgcolor: 'rgba(29,79,145,0.02)',
                              }}
                            >
                              <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
                              >
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'capitalize' }}>
                                    {expense.type}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                                    {expense.description}
                                  </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                    {formatCurrencyDisplay(expense.value)}
                                  </Typography>
                                  {!isSoldVehicle && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<EditRoundedIcon />}
                                      onClick={() => handleEditExpense(expense)}
                                      sx={{ fontWeight: 600 }}
                                    >
                                      Editar
                                    </Button>
                                  )}
                                  {!isSoldVehicle && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      startIcon={<DeleteOutlineRoundedIcon />}
                                      onClick={() => setExpenseDeleteTarget(expense)}
                                      sx={{ fontWeight: 600 }}
                                    >
                                      Excluir
                                    </Button>
                                  )}
                                </Stack>
                              </Stack>
                            </Paper>
                          ))
                        ) : (
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              borderColor: 'rgba(20,40,80,0.10)',
                              bgcolor: 'rgba(29,79,145,0.02)',
                            }}
                          >
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Nenhum gasto cadastrado para este veículo.
                            </Typography>
                          </Paper>
                        )}
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Vehicle details */}
              <Box>
                <FormSectionTitle title="Características" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Cor"
                      value={vehicleDetailsForm.color}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, color: event.target.value }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="KM atual"
                      value={vehicleDetailsForm.currentKm}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          currentKm: event.target.value.replace(/\D/g, ''),
                        }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Número de portas"
                      value={vehicleDetailsForm.doors}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, doors: event.target.value.replace(/\D/g, '') }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Combustível"
                      value={vehicleDetailsForm.fuel}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, fuel: event.target.value }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Câmbio"
                      value={vehicleDetailsForm.transmission}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({ ...prev, transmission: event.target.value }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Financial */}
              <Box>
                <FormSectionTitle title="Financeiro" uppercase />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="FIPE"
                      value={vehicleDetailsForm.fipe}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          fipe: toCurrencyDisplayFromInput(event.target.value),
                        }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Valor pago"
                      value={vehicleDetailsForm.paidValue}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          paidValue: toCurrencyDisplayFromInput(event.target.value),
                        }))
                      }}
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Data da compra"
                      value={vehicleDetailsForm.purchaseDate}
                      onChange={(event) => {
                        setVehicleDetailsForm((prev) => ({
                          ...prev,
                          purchaseDate: formatDateDisplay(event.target.value),
                        }))
                      }}
                      placeholder="dd/mm/aaaa"
                      disabled={isReadOnly}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              {isSoldVehicle && (
                <>
                  <Divider sx={{ borderStyle: 'dashed' }} />

                  <Box>
                    <FormSectionTitle title="Dados da venda e resultado" uppercase />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Valor vendido"
                          value={selectedVehicleDetails.soldValue ? formatCurrencyDisplay(selectedVehicleDetails.soldValue) : '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Custo total"
                          value={selectedVehicleDetails.totalCost ? formatCurrencyDisplay(selectedVehicleDetails.totalCost) : '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Lucro"
                          value={
                            typeof selectedVehicleDetails.soldValue === 'number' &&
                            typeof selectedVehicleDetails.totalCost === 'number'
                              ? formatCurrencyDisplay(
                                  selectedVehicleDetails.soldValue - selectedVehicleDetails.totalCost,
                                )
                              : '-'
                          }
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Data da venda"
                          value={selectedVehicleDetails.soldDate ? toDisplayDate(selectedVehicleDetails.soldDate) : '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Vendedor"
                          value={selectedVehicleDetails.sellerName ?? '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Comprador"
                          value={selectedVehicleDetails.buyerName ?? '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Documento do comprador"
                          value={selectedVehicleDetails.buyerDocument ?? '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Telefone do comprador"
                          value={selectedVehicleDetails.buyerPhone ?? '-'}
                          disabled
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        {!isSoldVehicle && (
          <Button
            color="success"
            variant="outlined"
            onClick={handleOpenSellDialog}
            disabled={isDisabled || sellingVehicleDetails}
            startIcon={<LocalAtmRoundedIcon />}
            sx={{
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {sellingVehicleDetails ? 'Vendendo...' : 'Marcar como vendido'}
          </Button>
        )}
        {!isSoldVehicle && (
          <Button
            color="error"
            variant="outlined"
            onClick={handleRequestDelete}
            disabled={isDisabled}
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {deletingVehicleDetails ? 'Excluindo...' : 'Excluir'}
          </Button>
        )}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            ml: { sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600, flex: { xs: 1, sm: 'none' } }}>
            Fechar
          </Button>
          {!isSoldVehicle && (
            <Button
              variant="contained"
              onClick={onUpdate}
              disabled={isDisabled}
              startIcon={<SaveRoundedIcon />}
              sx={{ fontWeight: 700, minWidth: 160, flex: { xs: 1, sm: 'none' } }}
            >
              {updatingVehicleDetails ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          )}
        </Stack>
      </DialogActions>

      <Dialog
        open={isSellDialogOpen}
        onClose={handleCloseSellDialog}
        aria-labelledby="sell-vehicle-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="sell-vehicle-dialog-title">Marcar veículo como vendido</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Valor vendido"
              value={sellForm.soldValue}
              onChange={(event) => {
                setSellForm((prev) => ({ ...prev, soldValue: toCurrencyDisplayFromInput(event.target.value) }))
              }}
              placeholder="R$ 0,00"
              fullWidth
            />
            <TextField
              label="Data da venda"
              type="date"
              value={sellForm.soldDate}
              onChange={(event) => {
                setSellForm((prev) => ({ ...prev, soldDate: event.target.value }))
              }}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Nome do comprador"
              value={sellForm.buyerName}
              onChange={(event) => {
                setSellForm((prev) => ({ ...prev, buyerName: event.target.value }))
              }}
              fullWidth
            />
            <TextField
              label="Documento do comprador"
              value={sellForm.buyerDocument}
              onChange={(event) => {
                setSellForm((prev) => ({ ...prev, buyerDocument: event.target.value }))
              }}
              fullWidth
            />
            <TextField
              label="Telefone do comprador"
              value={sellForm.buyerPhone}
              onChange={(event) => {
                setSellForm((prev) => ({ ...prev, buyerPhone: event.target.value }))
              }}
              fullWidth
            />
            <TextField
              label="Nome do vendedor"
              value={sellForm.sellerName}
              onChange={(event) => {
                setSellForm((prev) => ({ ...prev, sellerName: event.target.value }))
              }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseSellDialog} color="inherit" disabled={sellingVehicleDetails}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSell}
            color="success"
            variant="contained"
            disabled={sellingVehicleDetails}
            startIcon={<LocalAtmRoundedIcon />}
            sx={{ fontWeight: 700 }}
          >
            {sellingVehicleDetails ? 'Vendendo...' : 'Confirmar venda'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(expenseDeleteTarget)}
        onClose={() => {
          if (!deletingExpense) {
            setExpenseDeleteTarget(null)
          }
        }}
        aria-labelledby="confirm-expense-delete-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="confirm-expense-delete-dialog-title">Confirmar exclusão do gasto</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tem certeza que deseja excluir este gasto? Essa ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setExpenseDeleteTarget(null)}
            color="inherit"
            disabled={deletingExpense}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              void handleDeleteExpense()
            }}
            color="error"
            variant="contained"
            disabled={deletingExpense}
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ fontWeight: 700 }}
          >
            {deletingExpense ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="confirm-delete-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tem certeza que deseja excluir este veículo? Essa ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteConfirm} color="inherit" disabled={deletingVehicleDetails}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deletingVehicleDetails}
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ fontWeight: 700 }}
          >
            {deletingVehicleDetails ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}