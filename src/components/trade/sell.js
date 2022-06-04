import { Box, Button, OutlinedInput, TextField, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import CryptoContext, { CryptoState } from '../../crypto-context';
import { db } from '../../firebase';



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
  },
  symbol: {
      textTransform: "uppercase",
      color: "gray"
  },
  div: {
      display: "flex",
      justifyContent: "space-between"
    }
  }

const Sell = ({coin, handleClose}) => {

    const {user, currency, transactions, watchlist, setAlert, currencyRate } = CryptoState()

    const [base, setBase] = useState('USD')
    const [count, setCount] = useState(0)

    let isNotUsd = currency !== "USD"

    const sellTransaction = async () => {
      const quantity = base === 'USD' ? +total : +count
      const price = isNotUsd ? coin?.market_data.current_price[currency.toLowerCase()] / currencyRate : coin?.market_data.current_price[currency.toLowerCase()]

      let transactionDetails = {
        id: coin.id,
        quantity: -quantity,
        coin: coin.name,
        currency: currency,
        price: price ,
        date: new Date().toLocaleString(),
        type: 'sell'
      }
      const idx = watchlist.findIndex((elem) => elem.coin == coin.name)

      let newPortfolio = []
      let transaction = {}
      if (idx > -1) {
          transaction = {
              ...watchlist[idx],
              quantity: watchlist[idx].quantity + transactionDetails.quantity
          }
          newPortfolio = [
              ...watchlist.slice(0, idx),
              transaction,
              ...watchlist.slice(idx+1)
          ]
      } else {
          newPortfolio = [...watchlist, transaction]
      }
      
      const coinRef = doc(db, user?.uid, "portfolio") 

      
      try{
          await setDoc(coinRef,
          {coins: watchlist ? newPortfolio : [transaction],
          transactions: transactions ? [...transactions, transactionDetails] : [transactionDetails]},
          )
  
          setAlert({
              open: true,
              message: `You sold ${transactionDetails.quantity} ${transaction.name}`,
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


    const handleChange = (e) => {
      setCount(e.target.value)
    }
    const total = base == 'USD'? (count / coin?.market_data.current_price[currency.toLowerCase()]) : (count * coin?.market_data.current_price[currency.toLowerCase()])

  return (
    <Box sx={classes.box}>
      <div style = {classes.div}>
      <OutlinedInput
            sx = {{width: "76%"}}
            id="outlined-adornment-weight"
            onChange = {handleChange}
            value = {count}
          />
         <TextField
          id="outlined-select-currency-native"
          
          select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          SelectProps={{
            native: true,
          }}
        >
            <option value={currency}>
              {currency}
            </option>
            <option value={coin.symbol}>
              {coin.symbol.toUpperCase()}
            </option>
        </TextField>
      </div>
      <Typography sx={{textAlign:"right"}} variant='subtitle'>
            {total} <span style={classes.symbol}>{base == 'USD'? coin.symbol : currency}</span> 
      </Typography>

      <Button
        variant='outlined'
        size='large'
        sx={classes.btn}
        onClick = {sellTransaction}
        >
          SELL
      </Button>
    </Box>
  )
}

export default Sell