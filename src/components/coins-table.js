import { LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container } from '@mui/system'
import React from 'react'
import { useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CoinList } from '../config/api'
import { CryptoState } from '../crypto-context'

const CoinsTable = () => {

  const {currency, symbol, coins, loading, fetchCoins} = CryptoState()
  const history = useHistory()


  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

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

  
  const handleSearch = () => {
    return coins.filter((coin) => 
      coin.name.toLowerCase().includes(search) ||
      coin.symbol.toLowerCase().includes(search) 
    )
  }


  useEffect(() => {
    fetchCoins()
  }, [currency])

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode:"dark"
    },
  })

  const count = (handleSearch()?.length / 10).toFixed(0)

  return (
    <ThemeProvider theme={darkTheme}>
      <Container sx={classes.container} >
        <Typography
          variant='h4'
          sx={classes.title}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search For a Crypto Currency.."
          variant='outlined'
          sx={classes.serach}
          onChange = {(e) => setSearch(e.target.value)}
          value = {search}
          />
        <TableContainer>
          {
            loading ? (
              <LinearProgress sx={classes.loader} />
            ) : (
              <Table>
                <TableHead sx={classes.tableHead}>
                  <TableRow>
                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => {
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
                  {handleSearch().slice((page-1) * 10, (page-1) * 10 + 10)
                                    .map(row => {
                    const profit = row.price_change_percentage_24h > 0;

                    return (
                      <TableRow
                        onClick = {() => history.push(`/coins/${row.id}`)}
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
                          {symbol} {" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align='right'
                          sx={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}>
                            {profit && "+"}
                            {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.market_cap.toString().slice(0, -6))}
                          M
                        </TableCell>
                      </TableRow>
                    )

                  })}
                </TableBody>
              </Table>
            )
          }
        </TableContainer>
        <Pagination
          sx={classes.pagination}
          count = {count}
          onChange = {(_, value) => {
            setPage(value)
            window.scroll(0,450)
          }}
          >

        </Pagination>
      </Container>
    </ThemeProvider>
  )
}

export default CoinsTable