import { Box, Button, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { countMidPrice } from '../../config/utils';
import { CryptoState } from '../../crypto-context';
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

const Buy = ({coin, handleClose}) => {
    const {currency, user, watchlist, setAlert, transactions, currencyRate} = CryptoState()
    const [count, setCount] = useState(0)
    const [base, setBase] = useState('USD')
    let isNotUsd = currency !== "USD"
    console.log(coin);
    const toPortfolio = async () => {
        
        const quantity = base === 'USD' ? +total : +count
        const price = coin?.market_data.current_price['usd'] 
                                  

        let transactionToPortfolio = {
            id: coin.id,
            quantity,
            coin: coin.name,
            midPrice: price
        }
        const transactionToTransactions = {
          ...transactionToPortfolio,
          currency: currency,
          midPrice: null,
          price: price ,
          quantity: quantity,
          date: new Date().toLocaleString(),
          type: 'buy'
      }

      const midPrice = countMidPrice(transactions,transactionToTransactions,coin)

      const idx = watchlist.findIndex((elem) => elem.coin == coin.name)
      let newPortfolio = []
      if (idx > -1) {
          transactionToPortfolio = {
              ...watchlist[idx],
              midPrice: midPrice,
              quantity: watchlist[idx].quantity + quantity
          }
          newPortfolio = [
              ...watchlist.slice(0, idx),
              transactionToPortfolio,
              ...watchlist.slice(idx+1)
          ]
      } else {
          newPortfolio = [...watchlist, transactionToPortfolio]
      }

      const coinRef = doc(db, user?.uid, "portfolio") 

      
      try{
          await setDoc(coinRef,
          {coins: watchlist ? newPortfolio : [transactionToPortfolio],
          transactions: transactions ? [...transactions, transactionToTransactions] : [transactionToTransactions]},
          )
  
          setAlert({
              open: true,
              message: `${coin.name} Added to the Portfolio`,
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
        onClick = {toPortfolio}
        >
          BUY
      </Button>
    </Box>
  )
}

export default Buy