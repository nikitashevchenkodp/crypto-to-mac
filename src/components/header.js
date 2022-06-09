import React from 'react'
import { Toolbar, AppBar, Typography, Select, MenuItem } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Container } from '@mui/system';
import { useHistory } from 'react-router-dom';
import { CryptoState } from '../crypto-context';
import AuthModal from './authentication/auth-modal';
import UserSidebar from './authentication/user-sidebar';


const Header = () => {
  const history = useHistory()
  const {setCurrency, user} = CryptoState()

  const styles = {
    title: {
      flex: 1,
      color: "gold",
      fontFamily: "Montserrat",
      fontWeight: "bold",
      cursor: "pointer"
    }
  }

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode:"dark"
    },
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color = "transparent" position='static'>
        <Container>
          <Toolbar> 
            <Typography 
              onClick = {() => history.push("/")} 
              sx={styles.title}
              variant = 'h5' >
              Crypto Hunter
            </Typography>
            <Select
              defaultValue={"USD"}
              variant='outlined'
              style={{
                width:100,
                height: 40,
                marginRight:15
              }}
              onChange = {(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"} >USD</MenuItem>
              <MenuItem value={"UAH"} >UAH</MenuItem>
            </Select>
            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
     </ThemeProvider>
    
  )
}

export default React.memo(Header)