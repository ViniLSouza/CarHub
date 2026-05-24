import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatCurrencyDisplay, toDisplayDate } from '../../../shared/utils/formatters'

export type StockCarRow = {
  id: number
  brand: string
  model: string
  year: number
  soldValue?: number
  totalCost?: number
  soldDate?: string
  buyerName?: string
  buyerDocument?: string
  buyerPhone?: string
  sellerName?: string
}

type StockVehiclesTableProps = {
  rows: StockCarRow[]
  loading: boolean
  errorMessage: string
  onOpenDetails: (vehicleId: number) => void
  title?: string
  loadingLabel?: string
  emptyLabel?: string
  showSaleData?: boolean
}

export function StockVehiclesTable({
  rows,
  loading,
  errorMessage,
  onOpenDetails,
  title = 'Veículos em estoque',
  loadingLabel = 'Carregando veículos do estoque...',
  emptyLabel = 'Nenhum veículo disponível no estoque.',
  showSaleData = false,
}: StockVehiclesTableProps) {
  const columnCount = showSaleData ? 12 : 4

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(20,40,80,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Table header bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          borderBottom: '1px solid rgba(20,40,80,0.08)',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(29,79,145,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <DirectionsCarRoundedIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>
        {!loading && !errorMessage && (
          <Chip
            label={`${rows.length} registro${rows.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: 'rgba(29,79,145,0.08)', color: 'primary.main', fontWeight: 600 }}
          />
        )}
      </Box>

      {errorMessage && (
        <Alert
          severity="warning"
          icon={<WarningAmberRoundedIcon />}
          sx={{ m: 2, borderRadius: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      <TableContainer>
        <Table aria-label={showSaleData ? 'Tabela de veículos vendidos e resultado' : 'Tabela de veículos em estoque'}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: 'rgba(29,79,145,0.04)',
                '& .MuiTableCell-root': {
                  color: 'text.secondary',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  borderBottomColor: 'rgba(20,40,80,0.10)',
                  py: 1.5,
                },
              }}
            >
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell align="center">Ano</TableCell>
              {showSaleData && <TableCell align="right">Valor vendido</TableCell>}
              {showSaleData && <TableCell align="right">Custo total</TableCell>}
              {showSaleData && <TableCell align="right">Lucro</TableCell>}
              {showSaleData && <TableCell>Data da venda</TableCell>}
              {showSaleData && <TableCell>Comprador</TableCell>}
              {showSaleData && <TableCell>Documento</TableCell>}
              {showSaleData && <TableCell>Telefone</TableCell>}
              {showSaleData && <TableCell>Vendedor</TableCell>}
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columnCount} sx={{ py: 6 }}>
                  <Stack sx={{ alignItems: 'center' }} spacing={1.5}>
                    <CircularProgress size={28} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {loadingLabel}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((car) => (
                <TableRow
                  key={car.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    '& .MuiTableCell-root': {
                      borderBottomColor: 'rgba(20,40,80,0.07)',
                      py: 1.5,
                      whiteSpace: 'nowrap',
                    },
                    '&:hover': { bgcolor: 'rgba(29,79,145,0.03)' },
                    '&:last-child .MuiTableCell-root': { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {car.brand}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {car.model}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={car.year}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: 'rgba(29,79,145,0.08)',
                        color: 'primary.main',
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  {showSaleData && (
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {car.soldValue ? formatCurrencyDisplay(car.soldValue) : '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        {car.totalCost ? formatCurrencyDisplay(car.totalCost) : '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color:
                            typeof car.soldValue === 'number' && typeof car.totalCost === 'number'
                              ? car.soldValue - car.totalCost >= 0
                                ? 'success.main'
                                : 'error.main'
                              : 'text.secondary',
                        }}
                      >
                        {typeof car.soldValue === 'number' && typeof car.totalCost === 'number'
                          ? formatCurrencyDisplay(car.soldValue - car.totalCost)
                          : '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {car.soldDate ? toDisplayDate(car.soldDate) : '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {car.buyerName ?? '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {car.buyerDocument ?? '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {car.buyerPhone ?? '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {showSaleData && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {car.sellerName ?? '-'}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<InfoOutlinedIcon fontSize="small" />}
                      onClick={() => onOpenDetails(car.id)}
                      sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} sx={{ py: 6, borderBottom: 0 }}>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <DirectionsCarRoundedIcon sx={{ fontSize: 40, color: 'rgba(20,40,80,0.2)' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {emptyLabel}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}