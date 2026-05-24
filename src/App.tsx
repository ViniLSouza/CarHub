import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { EstoquePage } from './pages/Estoque/EstoquePage'
import { FipePage } from './pages/Fipe/FipePage'
import { HomePage } from './pages/Home/HomePage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'

function App() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Fipe', path: '/fipe' },
    { label: 'Estoque', path: '/estoque' },
    { label: 'Dashboard', path: '/dashboard' },
  ]

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f7fb' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(120deg, #0d1b2a 0%, #1b263b 55%, #415a77 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              CarHub
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: 999,
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: isActive ? 'rgba(255,255,255,0.20)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.14)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Stack>

            <IconButton
              aria-label="Abrir menu"
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 260, pt: 1 }} role="presentation">
          <Typography sx={{ px: 2, py: 1, fontWeight: 700 }}>Navegacao</Typography>
          <List>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  onClick={closeMobileMenu}
                >
                  <ListItemText primary={item.label} />
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
