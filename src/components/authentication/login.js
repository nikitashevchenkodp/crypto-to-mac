import { Box, Button, TextField } from '@mui/material'
import { signInWithEmailAndPassword } from '@firebase/auth'
import React from 'react'
import { useState } from 'react'
import { CryptoState } from '../../crypto-context'
import { auth } from '../../firebase'

const Login = ({handleClose}) => {

  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  const {setAlert} = CryptoState()

  const handleSubmit = async () => {
    if(!password || !email) {
      setAlert({
        open: true,
        message: "Please fill all the fields",
        type: "error"
      })
      return;
    }  

    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      setAlert({
        open: true,
        message: `Login Successful. Welcome ${res.user.email}`,
        type: "success"
      })
      handleClose()
    } catch(error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      })
    }
  }
  
  const classes = {
    box: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      padding: "10px"
    },
    btn: {
      backgroundColor: "#EEBC1D",
      color: "black"
    }
  }

  return (
    <Box sx={classes.box}>
      <TextField 
        variant='outlined'
        type="email"
        label = "Enter Email"
        value = {email}
        onChange = {(e) => setEmail(e.target.value)}
        fullWidth
        />

      <TextField 
        variant='outlined'
        type="password"
        label = "Enter Password"
        value = {password}
        onChange = {(e) => setPassword(e.target.value)}
        fullWidth
        />

      <Button
        variant='outlined'
        size='large'
        sx={classes.btn}
        onClick = {handleSubmit}
        >
          Log In
      </Button>
    </Box>
  )
}

export default Login