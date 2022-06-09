import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import {CryptoState} from '../../crypto-context'
import {createUserWithEmailAndPassword} from '@firebase/auth'
import {auth} from '../../firebase'


const SignUp = ({handleClose}) => {

  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const[confirmPassword, setConfirmPassword] = useState('')
  
  const {setAlert} = CryptoState()

  const handleSubmit = async () => {
    if(password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error"
      })
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${res.user.email}`,
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

      <TextField 
        variant='outlined'
        type="password"
        label = "Confirm Password"
        value = {confirmPassword}
        onChange = {(e) => setConfirmPassword(e.target.value)}
        fullWidth
        />
      <Button
        variant='outlined'
        size='large'
        sx={classes.btn}
        onClick = {handleSubmit}
        >
          Sign Up
      </Button>
    </Box>
  )
}

export default SignUp