import { Box, Paper, Stack, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'

type GradientHeroCardProps = {
  chip?: ReactNode
  title: ReactNode
  description?: ReactNode
  footer?: ReactNode
  sideContent?: ReactNode
  children?: ReactNode
  contentMaxWidth?: number | string
  stackSpacing?: number
  sx?: SxProps<Theme>
}

export function GradientHeroCard({
  chip,
  title,
  description,
  footer,
  sideContent,
  children,
  contentMaxWidth,
  stackSpacing = 2,
  sx,
}: GradientHeroCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid rgba(29,79,145,0.12)',
        p: { xs: 3, md: 4 },
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2f50 60%, #1d4f91 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={stackSpacing} sx={{ position: 'relative', maxWidth: contentMaxWidth }}>
        {chip}

        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box>
            {title}
            {description}
          </Box>
          {sideContent}
        </Box>

        {footer}
        {children}
      </Stack>
    </Paper>
  )
}
