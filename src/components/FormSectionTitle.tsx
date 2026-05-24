import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type FormSectionTitleProps = {
  title: string
  icon?: ReactNode
  uppercase?: boolean
  marginBottom?: number
}

export function FormSectionTitle({
  title,
  icon,
  uppercase = false,
  marginBottom = 1.5,
}: FormSectionTitleProps) {
  const titleNode = (
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 700,
        color: uppercase ? 'text.secondary' : 'text.primary',
        textTransform: uppercase ? 'uppercase' : 'none',
        fontSize: uppercase ? '0.72rem' : undefined,
        letterSpacing: uppercase ? 0.8 : undefined,
      }}
    >
      {title}
    </Typography>
  )

  if (!icon) {
    return <Box sx={{ mb: marginBottom }}>{titleNode}</Box>
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: marginBottom }}>
      <Box sx={{ color: 'primary.main' }}>{icon}</Box>
      {titleNode}
    </Box>
  )
}
