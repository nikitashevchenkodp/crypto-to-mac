import { Box, Button, TextField } from '@mui/material';
import React from 'react'



const classes = {
    main: {
        color: "white"
    },
    box: {
      padding: "3px",
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

const Sell = () => {
    console.log('render');
  return (
    <Box sx={classes.box}>
      <TextField
        variant='outlined'
        type="email"
        label = "Enter Email"
        fullWidth
        />

      <TextField 
        variant='outlined'
        type="password"
        label = "Enter Password"
        fullWidth
        />

      <Button
        variant='outlined'
        size='large'
        sx={classes.btn}
        >
          Log In
      </Button>
    </Box>
  )
}

export default Sell