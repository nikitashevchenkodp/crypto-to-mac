import { Box, Container, createTheme, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import PieChart from '../../components/pie-chart'
import { namesOfTableHead } from '../../config/data'
import { countPercentageChange, countTotalSum, findPortfolio, numberWithCommas } from '../../config/utils'
import { CryptoState } from '../../crypto-context'
import { classes } from './portfolio-page-styles'
import {BsBriefcase} from 'react-icons/bs'
import NotAutorized from '../../components/not-autorized'
import Loader from '../../components/loader'


const PortfolioPage = () => {

  const { watchlist, coins, symbol, loading, currencyRate, transactions, fetchCoins, currency, user } = CryptoState()
  const [portfolio, setPortfolio] = useState([])
  const history = useHistory()

  useEffect(() => {
    fetchCoins()
  }, [currency])

  useEffect(() => {
    setPortfolio(findPortfolio(watchlist, coins))
  }, [watchlist, coins])

  const [percentage, different] = countPercentageChange(transactions, portfolio, currencyRate)
  const formatTotalSum = numberWithCommas(countTotalSum(portfolio, currencyRate).toFixed(2))
  const formatDifferent = numberWithCommas(different.toFixed(2))

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark"
    },
  })

  if(loading) {
    return (
      <div style={{textAlign: "center"}}>
        <Loader />
      </div>
    )
  }

  if(!user) {
    return (
      <NotAutorized />
    )
  }

  if (watchlist.length == 0) {
    return (
      <div style={{textAlign: "center", marginTop: "150px"}}>
        <Typography variant='h3' sx={{fontWeight: "700", marginBottom: "20px"}} > Your Portfolio is Empty </Typography>
        <BsBriefcase size={200} color={"gold"}/>
      </div>
    )
  }

  

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Typography
          variant='h3'
          sx={classes.title}
        >
          Your Portfolio
        </Typography>
        <div style={{ display: "flex" , marginBottom: "20px"}}>
          <Box
            sx={classes.mainBox}
          >
            <div style={classes.windowDiv}>
              <span style={classes.currentBalance}>
                Current balance
              </span>
              <span style={classes.totalSum}>
                $ {formatTotalSum} {symbol}
              </span>

            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ backgroundColor: percentage > 0 ? "rgba(0, 255, 0, 0.3)" : "rgba(212, 8, 8, 0.3)", borderRadius: "15px", padding: "3px 6px", marginBottom: "5px", display: "inline-block" }}>{percentage.toFixed(2)}%</span>
              <span style={{ color: different > 0 ? "green" : "red", marginBottom: "8px", fontSize: "18px", display: "block" }}>
                {formatDifferent} {symbol}
              </span>
            </div>
          </Box>
          <div style={{ position: "relative", height: "40vh", width: "80vw" }}>
            <PieChart />
          </div>
        </div>
        <TableContainer>
              <Table>
                <TableHead sx={classes.tableHead}>
                  <TableRow>
                    {namesOfTableHead.map((head) => {
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
                  {portfolio.map(row => {
                    const isGrowth = row.price_change_percentage_24h > 0;
                    const isProfit = row.current_price >= row.midPrice * currencyRate
                    return (
                      <TableRow
                        key={row.name}
                        sx={classes.row}
                        onClick={() => history.push(`/portfolio/${row.id}`)}
                      >
                        <TableCell component="th" scope="row"
                          sx={classes.tableBodyCell}>
                          <img src={row?.image} alt={row.name} style={classes.img} />
                          <div style={classes.cryptoCell}>
                            <span style={classes.cryptoSymbol}>
                              {row.symbol}
                            </span>
                            <span style={classes.cryptoName}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align='right'>
                          <div style={classes.currentPrice}>
                            <div>
                              {symbol} {" "}
                              {numberWithCommas((row.current_price * currencyRate).toFixed(2))}
                            </div >
                            <span style={{
                              color: isGrowth > 0 ? "rgb(14, 203, 129)" : "red",
                              fontWeight: 500,
                            }}>{row.price_change_percentage_24h.toFixed(2)}%</span>
                          </div>
                        </TableCell>
                        <TableCell
                          align='right'
                          sx={{ fontWeight: 500 }}>
                          {row.quantity.toFixed(4)} {row.symbol.toUpperCase()}
                        </TableCell>
                        <TableCell align="right">
                          <div>
                            {symbol}{" "}
                            <span >{(currencyRate * row.midPrice).toFixed(2)}</span>
                          </div>
                          <span style={{
                            color: isProfit ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}>{isProfit ? `+${((1 - ((row.midPrice * currencyRate) / (row.current_price * currencyRate))) * 100).toFixed(2)}` : ((1 - ((row.midPrice * currencyRate) / (row.current_price * currencyRate))) * 100).toFixed(2)}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  )
}

export default PortfolioPage