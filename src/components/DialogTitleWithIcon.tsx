import { Box, DialogTitle, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type DialogTitleWithIconProps = {
  id: string
  icon: ReactNode
  title: string
  subtitle: string
}

export function DialogTitleWithIcon({ id, icon, title, subtitle }: DialogTitleWithIconProps) {
  return (
    <DialogTitle id={id} sx={{ pb: 1 }}>
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
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </DialogTitle>
  )
}
