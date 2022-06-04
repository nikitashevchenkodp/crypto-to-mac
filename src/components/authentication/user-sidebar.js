import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { CryptoState } from '../../crypto-context';
import { Avatar, styled } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';

const UserSidebar = () => {
  const [state, setState] = useState({
    right: false,
  });
  const history = useHistory()
  const {user, setAlert, watchlist, coins, symbol} = CryptoState()

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    console.log('toggleDrawer');
    setState({ ...state, [anchor]: open });
  };
  

  const logOut = () => {
    signOut(auth)
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !"
    })
    toggleDrawer()
  }
  console.log(state);

  function toPortfolio () {
    setState({ ...state, right : false })
    history.push('/portfolio')
    
  }

  const removeFromWatchList = async (coin) => {
    const coinRef = doc(db, user.uid, "portfolio");

    try{
      await setDoc(coinRef,
        {coins: watchlist.filter((watch) => watch !== coin?.id ) },
        {merge: true})

        setAlert({
          open: true,
          message: `${coin.name} Remover from the Watchlist`,
          type: "success"
        })
    } catch(error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      })
    }

  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const classes = {
    avatar: {
      height: "38px",
      width: "38px",
      cursor: "pointer",
      backgroundColor: "#EEBC1d"
    },
    name: {
      width: "100%",
      fontSize: "25px",
      textAlign: "center",
      fontWeight: "bolder",
      wordWrap: "break-word"
    },
    profile: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    },
    picture: {
      width: "80px",
      height: "80px",
      cursor: "pointer",
      backgroundColor: "#EEBC1D",
      odjectFit: "contain"
    },
    logOut: {
      height: "8%",
      width: "100%",
      backgroundColor: "#EEBC1D",
      marginTop: "20px"
    }
  }

  return (
    <div>
        <React.Fragment>
          <Avatar
            onClick={toggleDrawer('right',true)}
            sx={classes.avatar}
            src = {user.photoURL} 
            alt = {user.displayName || user.email}
             />
          <Drawer
            sx={{
              "& .MuiPaper-root": {
                top: 65,
                height: "500px",
                width: "340px"
              }
            }}
            anchor={'right'}
            open={state['right']}
            onClose={toggleDrawer('right', false)}
          >
            <MainRoot>
              <div style={classes.profile} >
                <Avatar
                  sx={classes.picture}
                  src = {user.photoURL} 
                  alt = {user.displayName || user.email} />
                <span style = {classes.name}>
                  {user.displayName || user.email}
                </span>
              </div>
              <Button 
                variant='contained'
                sx={classes.logOut}
                onClick={toPortfolio} >
                  My Portfolio
                </Button>
              <Button 
                variant='contained'
                sx={classes.logOut}
                onClick={logOut} >
                  Log Out
                </Button>
            </MainRoot>
          </Drawer>
        </React.Fragment>
    </div>
  );
}

const MainRoot = styled('div')(({theme}) => ({
  width: "350px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "25px",
}))

export default UserSidebar