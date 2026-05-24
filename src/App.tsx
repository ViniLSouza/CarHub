import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { EstoquePage } from './pages/Estoque/EstoquePage'
import { FipePage } from './pages/Fipe/FipePage'
import { HomePage } from './pages/Home/HomePage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'

const navItems = [
  { label: 'Home', path: '/', icon: <HomeRoundedIcon fontSize="small" /> },
  { label: 'Fipe', path: '/fipe', icon: <SearchRoundedIcon fontSize="small" /> },
  { label: 'Estoque', path: '/estoque', icon: <Inventory2RoundedIcon fontSize="small" /> },
  { label: 'Dashboard', path: '/dashboard', icon: <SpeedRoundedIcon fontSize="small" /> },
]

function App() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev)
  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2f50 60%, #1d4f91 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 68 }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b6ab5, #0ea5e9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(14,165,233,0.4)',
                }}
              >
                <DirectionsCarFilledRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, letterSpacing: '-0.3px', color: '#fff' }}
              >
                Car<Box component="span" sx={{ color: '#38bdf8' }}>Hub</Box>
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop nav */}
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      px: 2,
                      py: 0.875,
                      borderRadius: 999,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      bgcolor: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                      border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' },
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Stack>

            {/* Mobile menu button */}
            <IconButton
              aria-label="Abrir menu"
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280 }} role="presentation">
          {/* Drawer header */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1d4f91 100%)',
              color: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarFilledRoundedIcon sx={{ color: '#38bdf8' }} />
              <Typography sx={{ fontWeight: 800, letterSpacing: '-0.3px' }}>
                Car<Box component="span" sx={{ color: '#38bdf8' }}>Hub</Box>
              </Typography>
            </Box>
            <IconButton size="small" onClick={closeMobileMenu} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          <Box sx={{ px: 1.5, py: 1.5 }}>
            <Typography variant="caption" sx={{ px: 1, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
              Navegação
            </Typography>
          </Box>

          <List sx={{ px: 1.5, pt: 0 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  onClick={closeMobileMenu}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#fff',
                      '& .MuiListItemIcon-root': { color: '#fff' },
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#fff' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ '& .MuiListItemText-primary': { fontWeight: isActive ? 700 : 500 } }}
                  />
                  {isActive && (
                    <Chip label="Atual" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.25)', color: '#fff' }} />
                  )}
                </ListItemButton>
              )
            })}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fipe" element={<FipePage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/dashboard" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
