import { Box, Container, createTheme, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { namesOfTableHead } from '../../config/data'
import { countPercentageChange, countTotalSum, findPortfolio, numberWithCommas } from '../../config/utils'
import { CryptoState } from '../../crypto-context'
import { classes } from './portfolio-page-styles'


const PortfolioPage = () => {

  const { watchlist, coins, symbol,loading, currencyRate, transactions } = CryptoState()
  const [portfolio, setPortfolio] = useState([])
  const history = useHistory()


  useEffect(() => {
    setPortfolio(findPortfolio(watchlist, coins))
  }, [watchlist, coins])

  const [percentage, different] = countPercentageChange(transactions, portfolio, currencyRate)
  const formatTotalSum = numberWithCommas(countTotalSum(portfolio).toFixed(2))
  const formatDifferent = numberWithCommas(different.toFixed(2))

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark"
    },
  })

  if (watchlist.length == 0) {
    return (
      <div>
        Your Portfolio is empty
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
        <Box
          sx={classes.mainBox}
        >
          <div style={classes.windowDiv}>
            <span style={classes.currentBalance}>
              Current balance
            </span>
            <span style={classes.totalSum}>
              $ {formatTotalSum}
            </span>
            <span style={{ color: different > 0 ? "green" : "red", marginBottom: "8px", fontSize: "18px" }}>
              {formatDifferent} $
            </span>
          </div>
          <div>
            <span style={{ backgroundColor: percentage > 0 ? "rgba(0, 255, 0, 0.3)" : "rgba(212, 8, 8, 0.3)", borderRadius: "15px", padding: "3px 6px" }}>{percentage.toFixed(2)}%</span>
          </div>
        </Box>
        <TableContainer>
          {
            loading ? (
              <LinearProgress sx={classes.loader} />
            ) : (
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
                              {numberWithCommas(row.current_price.toFixed(2))}
                            </div >
                            <span style={{
                              color: isGrowth > 0 ? "rgb(14, 203, 129)" : "red",
                              fontWeight: 500,
                            }}>{row.price_change_percentage_24h.toFixed(2)}%</span>
                          </div>
                        </TableCell>
                        <TableCell
                          align='right'
                          sx={{fontWeight: 500}}>
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
                          }}>{isProfit ? `+${((1 - ((row.midPrice * currencyRate) / row.current_price)) * 100).toFixed(4)}` : `-${((((row.midPrice * currencyRate) / row.current_price) - 1) * 100).toFixed(4)}`}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )
          }
        </TableContainer>
      </Container>
    </ThemeProvider>
  )
}

export default PortfolioPage