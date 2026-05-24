import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PriceCheckRoundedIcon from '@mui/icons-material/PriceCheckRounded'
import { Box, Chip, Typography } from '@mui/material'
import { GradientHeroCard } from '../../../components/GradientHeroCard'

export function FipeHeader() {
  return (
    <GradientHeroCard
      chip={
        <Chip
          icon={<SearchRoundedIcon />}
          label="Tabela FIPE"
          sx={{
            width: 'fit-content',
            fontWeight: 700,
            bgcolor: 'rgba(56,189,248,0.18)',
            color: '#38bdf8',
            border: '1px solid rgba(56,189,248,0.3)',
            '& .MuiChip-icon': { color: '#38bdf8' },
          }}
        />
      }
      title={
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
          Consulte valores de veículos com{' '}
          <Box component="span" sx={{ color: '#38bdf8' }}>
            rapidez e clareza
          </Box>
        </Typography>
      }
      description={
        <Typography sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 680, lineHeight: 1.7 }}>
          Selecione tipo, marca, modelo e ano para buscar a referência de preço atualizada na tabela FIPE.
        </Typography>
      }
      footer={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 0.5 }}>
          <PriceCheckRoundedIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            Dados atualizados mensalmente pela FIPE
          </Typography>
        </Box>
      }
      stackSpacing={1.5}
    />
  )
}
