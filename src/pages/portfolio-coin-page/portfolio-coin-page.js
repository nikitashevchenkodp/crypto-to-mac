import { Container, createTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SingleCoin } from '../../config/api'
import CurrencyApiService from '../../config/curency-api-service'
import { CryptoState } from '../../crypto-context'
import {BsFillArrowDownCircleFill} from 'react-icons/bs'
import { numberWithCommas } from '../../config/utils'

const styles = {
  coinBox: {
    margin: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    width: "100%",
    backgroundColor: 'transparent',
    borderRadius: "19px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
  },
  container: {
    display:"flex", 
    justifyContent: "space-around",
    marginTop: "30px"
  },
  img: {
    marginRight: "5px",
    height: "50px"
  },
  coinContainer: { 
    display: "flex",
    alignItems: "flex-start", 
    flexDirection: "column" 
  },
  coinDiv: { 
    display: "flex",
    marginBottom: "10px" 
  },
  changes: { 
    borderRadius: "15px",
    padding: "3px 6px" 
  }



}

//Sum all coin transactions
const countCoinSum = (transactions, coin, currencyRate) => {
  const findTransactions = transactions.filter((tran) => tran.coin === coin?.name)
  const sumCoinTransactions = findTransactions.reduce((pv, tran) => pv + (tran.price * tran.quantity), 0) * currencyRate
  return [sumCoinTransactions, findTransactions]
}

  

const PortfolioCoinPage = () => {

  const { watchlist, currency, transactions, currencyRate } = CryptoState()
  const [coin, setCoin] = useState()
  const { id } = useParams()

  const fetchCoin = async () => {
    const res = await fetch(SingleCoin(id))
    res.json().then(data => setCoin(data))
  }

  useEffect(() => {
    fetchCoin()
  }, [])

  

  const coinInPortfolio = watchlist.filter((watch) => watch.coin === coin?.name)
  //Total sum of this coin i portfolio
  const actualTotalSum = coinInPortfolio[0]?.quantity * coin?.market_data.current_price[currency.toLowerCase()]

  const [sumCoinTransactions, findTransactions] = countCoinSum(transactions, coin, currencyRate)
  //Percentage change this coin in portfolio
  const countCoinChangePercentage = ((actualTotalSum / sumCoinTransactions) - 1) * 100

  //Percentage chenge this coin on market
  const calculatePercentageChange = coinInPortfolio[0]?.midPrice < coin?.market_data.current_price[currency.toLowerCase()] ? `+${((1 - ((coinInPortfolio[0]?.midPrice * currencyRate) / coin?.market_data.current_price[currency.toLowerCase()])) * 100).toFixed(4)}` : `-${((((coinInPortfolio[0]?.midPrice * currencyRate) / coin?.market_data.current_price[currency.toLowerCase()]) - 1) * 100).toFixed(4)}`


  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark"
    },
  })



  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container sx={styles.container}>
          <div style={{padding: "15px"}}>
            <Box sx={styles.coinBox}>
              <div style={styles.coinContainer} >
                <div style={styles.coinDiv}>
                  <img src={coin?.image.large} alt={coin?.name} style={styles.img} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span >
                      {coin?.name}
                    </span>
                    <span style={{ color: 'darkgrey' }}>
                      {coin?.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: "20px", marginBottom: "8px"}}>
                  $ {numberWithCommas(actualTotalSum.toFixed(2))}
                </span>
                <span style={{ textAlign: "left"}}>
                  {coinInPortfolio[0]?.quantity.toFixed(4)}
                </span>
              </div>
              <div>
                <span style={{...styles.changes, backgroundColor: calculatePercentageChange > 0 ? "rgba(0, 255, 0, 0.3)" : "rgba(212, 8, 8, 0.3)"}}>{calculatePercentageChange}%</span>
              </div>
            </Box>
            <Box sx={styles.coinBox}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "darkgrey", marginBottom: "7px" }}>Total Profit/Lose</span>
                <span>{numberWithCommas((actualTotalSum - sumCoinTransactions).toFixed(2))} $</span>
              </div>
              <div>
                  <span style={{...styles.changes, backgroundColor: countCoinChangePercentage > 0 ? "rgba(0, 255, 0, 0.3)" : "rgba(212, 8, 8, 0.3)"}}>{countCoinChangePercentage.toFixed(2)}%</span>
              </div>
            </Box>
          </div>
          <TableContainer sx={{width: "50%"}}>
            <Typography sx={{fontSize: "18px", fontWeight: "700"}}>
              Transaction History
            </Typography>
            <Table sx={{ minWidth: "50%" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {findTransactions.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <div style={{display: "flex", alignItems: "center"}}>
                      <BsFillArrowDownCircleFill color='green' />
                      <div style={{display: "flex", flexDirection: "column", marginLeft: "6px"}}>
                        <span>Buy</span>
                        <span style={{color:"darkgrey"}}>{row.date}</span>
                      </div>
                      </div>
                    </TableCell>
                    <TableCell align="right" sx={{display: "flex", flexDirection: "column"}}>
                      <span>{row.quantity.toFixed(4)}</span>
                      <span style={{color:"darkgrey"}} >{coin?.symbol.toUpperCase()}</span>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </Container>
      </ThemeProvider>
    </>
  )
}

export default PortfolioCoinPage