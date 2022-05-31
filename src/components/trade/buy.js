import { Box, Button, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
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
    const [midPrice, setMidPrice] = useState(0)

    console.log(currencyRate);

    const countMidPrice = (transactions, coin) => {
        let uah = []
        let usd = []
        const findCoin = transactions.filter((tran) => tran.coin === coin.name)
        console.log("find coins", coin);
        
        for(let i = 0; i < findCoin.length; i++) {
            if(findCoin[i].currency === "UAH") {
                uah.push(findCoin[i])
            } else {
                usd.push(findCoin[i])
            }
        }
        
        const sumUah = uah.reduce((pv, tran) => pv + (tran.price / currencyRate) * tran.quantity ,0)
        const sumUsd = usd.reduce((pv, tran) => pv + tran.price * tran.quantity ,0)

        const totQuantity = findCoin.reduce((pv,tran) => pv + tran.quantity, 0)

        const midPrice = (sumUah + sumUsd) / totQuantity

        setMidPrice(midPrice)
    }

    useEffect(() => {
        countMidPrice(transactions, coin)
    }, [transactions])
    


    const toPortfolio = async () => {
        const quantity = base == 'USD' ? +total : +count
        let transaction = {
            quantity,
            coin: coin.name,
            currency: currency,
            midPrice: currency === 'UAH' ? coin?.market_data.current_price[currency.toLowerCase()] / currencyRate : coin?.market_data.current_price[currency.toLowerCase()]
        }
        console.log(watchlist);
        const idx = watchlist.findIndex((elem) => elem.coin == coin.name)
        let newPortfolio = []
        if (idx > -1) {
            transaction = {
                ...watchlist[idx],
                currency: currency,
                midPrice: midPrice,
                quantity: watchlist[idx].quantity + quantity
            }
            newPortfolio = [
                ...watchlist.slice(0, idx),
                transaction,
                ...watchlist.slice(idx+1)
            ]
        } else {
            newPortfolio = [...watchlist, transaction]
        }

        const transactionDetails = {
            ...transaction,
            midPrice: null,
            price: coin?.market_data.current_price[currency.toLowerCase()],
            quantity: quantity,
            date: new Date()
        }

        const coinRef = doc(db, user?.uid, "portfolio") 

        
        try{
            await setDoc(coinRef,
            {coins: watchlist ? newPortfolio : [transaction],
            transactions: transactions ? [...transactions, transactionDetails] : [transactionDetails]},
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
          Confirm
      </Button>
    </Box>
  )
}

export default Buy