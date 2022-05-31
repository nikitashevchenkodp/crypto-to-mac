import { ClassNames } from '@emotion/react'
import React from 'react'

const SelectButton = ({children, selected, onClick}) => {
  
  const classes = {
    button: {
      border: "1px solid gold",
      borderRadius: "5px",
      padding: "10px 20px",
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: selected ? "gold" : "",
      color: selected ? "black" : "",
      fontWeight: selected ? "700" : "500",
      "&:hover": {
        backgroundColor: "gold",
        color: "black"
      },
      width: "22%"
    }
  }
  
  return (
    <span 
      onClick = {onClick}
      style={classes.button}>
      {children}
    </span>
  )
}

export default SelectButton