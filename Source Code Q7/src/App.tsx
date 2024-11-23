import './App.css'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import CSVReader from './component/CSVReader'

import logo from '../src/assets/Logo-kaltura.svg'
function App() {

  return (<>
    <AppBar position="static" sx={{ marginBottom: 4 }}>

      <Toolbar>
        <Box component='img' alt='logo' width='100' height='auto' src={logo} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

      </Toolbar>
    </AppBar>
    <Container maxWidth="lg">
      <CSVReader />
      <Typography variant='caption'> Made By Sultan Khalaily | 0502570160</Typography>
    </Container>
  </>
  )
}

export default App
