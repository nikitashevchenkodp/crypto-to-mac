import { Container, Typography } from '@mui/material'
import React from 'react'
import './banner.css'
import Carousel from './carousel'



const Banner = () => {
  
  const classes = {
    bannerContent: {
      height: "400px",
      display: "flex",
      flexDirection: "column",
      paddingTop: "25px",
      justifyContent: "space-around"
    },
    title: {
      fontWeight: "bold",
      marginBottom: "15px",
      fontFamily: "Montserrat"
    },
    subtitle: {
      color: "darkgrey",
      textTransform: "capitalize",
      fontFamily: "Montserrat"
    },
    tagline: {
      display: "flex",
      height: "40%",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center"
    }
  }


  return (
    <div className="banner"> 
      <Container sx={classes.bannerContent}>
        <div style={classes.tagline}>
          <Typography variant='h2' sx={classes.title}>
            Crypto Hunter
          </Typography>
          <Typography variant='subtitle2' sx={classes.subtitle}>
            Get all the info regarding your favorite Crypto Currency
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  )
}

export default Banner