import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { Tabs,Tab } from '@mui/material';
import { useState } from 'react';
import Login from './login';
import SignUp from './sign-up';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { CryptoState } from '../../crypto-context';
import { auth } from '../../firebase';



const classes = {
  style: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'background.paper',
    color: "white",
    p: 4,
  },
  button: {
    width: "85px",
    height: "40px",
    backgroundColor: "#EEBC1D"
  },
  tabs: {
    bgcolor: 'background.paper',
    width: "400px",
    borderRadius: "10px"
  },
  tab: {
    width: "50%"
  },
  google: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}



const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {setAlert} = CryptoState()

  const googleProvider = new GoogleAuthProvider()

  const signWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(res => {
        setAlert({
          open: true,
          message: `Login Successful. Welcome ${res.user.email}`,
          type: "success"
        })

        handleClose()
      }).catch(error => setAlert({
        open: true,
        message: error.message,
        type: "error"
      }))
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(value);
  return (
    <div>
      <Button sx={classes.button} variant='contained' onClick={handleOpen}>Login</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={classes.style}>
            <Tabs sx={classes.tabs} value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab sx={classes.tab} label="login"  />
              <Tab sx={classes.tab} label="Sign Up"  />
            </Tabs>

              {value===0 && <Login handleClose = {handleClose} />}
              {value===1 && <SignUp handleClose = {handleClose} />}
              <Box sx={classes.google}>
                <span>OR</span>
                <Button onClick= {signWithGoogle} variant='outlined' sx={{backgroundColor: "white", color: "black"}}>
                  Login with Google
                </Button>
              </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AuthModal