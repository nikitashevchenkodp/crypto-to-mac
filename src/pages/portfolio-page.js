import { createTheme, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CurrencyApiService from '../config/curency-api-service'
import { CryptoState } from '../crypto-context'


const PortfolioPage = () => {
 
    const {watchlist, coins, loading, symbol, currencyRate} = CryptoState()

    const findPortfolio = (watchlist, coins) => {
        let res = []
        for(let i = 0; i < coins.length; i++) {
            for(let j = 0; j < watchlist.length; j++) {
                if (coins[i].name === watchlist[j].coin) {
                    let newCoin = {
                        ...coins[i],
                        quantity: watchlist[j].quantity,
                        midPrice: watchlist[j].midPrice
                    }
                    res.push(newCoin)
                }
            }
        }
        return res
    }


    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      
    const classes = {
        container: {
          textAlign: "center"
        },
        title: {
          margin: "18px",
          fontFamily: "Montserrat"
        },
        serach: {
          marginBottom: "20px",
          width: "100%"
        },
        loader: {
          backgroundColor: "gold"
        },
        tableHead: {
          backgroundColor: "#EEBC1D"
        },
        tableCell: {
          color: "black",
          fontWeight: "700",
          fontFamily: "Montserrat"
        },
        row: {
          backgroundColor: "#16171a",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#131111",
          },
          fontFamily: "Montserrat",
        },
        tableBodyCell : {
          display: "flex",
          gap: "15px"
        },
        cryptoCell: {
          display: "flex",
          flexDirection: "column",
        },
        cryptoSymbol: {
          textTransform: "uppercase",
          fontSize: 22
        },
        cryptoName:{
          color: "darkgrey"
        },
        pagination: {
          padding: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }
    
    
      }
    
      const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
          },
          mode:"dark"
        },
      })

    if (watchlist.length == 0) {
        return (
            <div>
                Your Portfel is empty
            </div>
        )
    }  
  return (
    <div>
        <ThemeProvider theme={darkTheme}>
        <Typography 
            variant='h3'
            pl={"50px"}
            sx={{fontWeight: 700, paddingBottom: "40px", paddingTop: "20px", textAlign: "center"}}>
            Your Portfolio
        </Typography>
        <TableContainer>
          {
            loading ?  (
              <LinearProgress sx={classes.loader} />
            ) : (
              <Table>
                <TableHead sx={classes.tableHead}>
                  <TableRow>
                    {["Coin", "Price", "Quantity", "Mid Price"].map((head) => {
                      return (<TableCell 
                                sx={classes.tableCell}
                                key={head}
                                align={head === "Coin" ? "left" : "right"} >
                                {head}
                              </TableCell>)
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {findPortfolio(watchlist, coins).map(row => {
                      console.log(row);
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        key = {row.name}
                        sx = {classes.row}
                      >
                        <TableCell component="th" scope="row"
                          sx = {classes.tableBodyCell}>
                          <img src={row?.image} alt = {row.name} height = "50" style={{marginBottom: 10}} />
                          <div style={classes.cryptoCell}>
                            <span style = {classes.cryptoSymbol}>
                              {row.symbol}
                            </span>
                            <span style = {classes.cryptoName}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align='right'>
                        <div style={{display:"flex", flexDirection: "column"}}>
                            <div>
                            {symbol} {" "}
                            {numberWithCommas(row.current_price.toFixed(2))}
                            </div >
                            <span style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}>{row.price_change_percentage_24h.toFixed(2)}%</span>
                          </div>
                        </TableCell>
                        <TableCell
                          align='right'
                          sx={{
                            fontWeight: 500,
                          }}>
                    
                            {row.quantity.toFixed(4)} {row.symbol.toUpperCase()}
                        </TableCell>
                        <TableCell align="right">
                          <div>
                          {symbol}{" "}
                          <span >{(currencyRate * row.midPrice).toFixed(2)}</span>
                          </div>
                          <span style={{
                            color: row.current_price >= row.midPrice * currencyRate  ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}>{row.current_price >= row.midPrice * currencyRate  ? `+${((1 -((row.midPrice * currencyRate)/ row.current_price))*100).toFixed(4)}` : `-${((((row.midPrice * currencyRate) / row.current_price) - 1)*100).toFixed(4)}`}</span>
                        </TableCell>
                      </TableRow>
                    )

                  })}
                </TableBody>
              </Table>
            )
          }
        </TableContainer>
    </ThemeProvider>
    </div>
  )
}

export default PortfolioPage