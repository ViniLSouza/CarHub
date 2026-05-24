import { Alert, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

export type StockCarRow = {
  id: number
  brand: string
  model: string
  year: number
}

type StockVehiclesTableProps = {
  rows: StockCarRow[]
  loading: boolean
  errorMessage: string
  onOpenDetails: (vehicleId: number) => void
}

export function StockVehiclesTable({ rows, loading, errorMessage, onOpenDetails }: StockVehiclesTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(20, 40, 80, 0.10)',
        overflow: 'hidden',
      }}
    >
      {errorMessage && (
        <Alert severity="warning" sx={{ m: 2, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TableContainer>
        <Table aria-label="Tabela de carros em estoque">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: 'rgba(29, 79, 145, 0.06)',
                '& .MuiTableCell-root': {
                  color: '#1a355a',
                  fontWeight: 700,
                  borderBottomColor: 'rgba(20, 40, 80, 0.12)',
                },
              }}
            >
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell align="right">Ano</TableCell>
              <TableCell align="right">Acoes</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#3d4f6c' }}>
                  Carregando veiculos...
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((car) => (
                <TableRow
                  key={car.id}
                  hover
                  sx={{
                    '& .MuiTableCell-root': { borderBottomColor: 'rgba(20, 40, 80, 0.10)' },
                  }}
                >
                  <TableCell sx={{ color: '#1f2f4a', fontWeight: 600 }}>{car.brand}</TableCell>
                  <TableCell sx={{ color: '#3d4f6c' }}>{car.model}</TableCell>
                  <TableCell align="right" sx={{ color: '#1f2f4a', fontWeight: 600 }}>
                    {car.year}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onOpenDetails(car.id)}
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 999 }}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#3d4f6c' }}>
                  Nenhum veiculo cadastrado no estoque.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}