import { styled, Typography } from '@mui/material'
import React from 'react';
import {BsArrowReturnRight} from 'react-icons/bs'

const NotAutorized = () => {
  return (
    <MainDiv>
      <Typography variant='h3'>
        Login if you have an account,
      </Typography>
      <Typography variant='h3'>
        or create new account <BsArrowReturnRight style={{transform: "rotate(-90deg)", color:"gold"}}/>
      </Typography>
    </MainDiv>
  )
}

export default NotAutorized

const MainDiv = styled('div')({
  paddingTop: "100px",
  textAlign: "center",
  fontSize: "22px"
})