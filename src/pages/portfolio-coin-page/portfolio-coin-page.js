import { Button, Container, createTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SingleCoin } from '../../config/api'
import { CryptoState } from '../../crypto-context'
import {BsFillArrowDownCircleFill} from 'react-icons/bs'
import { countTotalSum, findPortfolio, numberWithCommas } from '../../config/utils'
import TradeWindow from '../../components/trade/trade-window'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useHistory } from 'react-router-dom'
import NotAutorized from '../../components/not-autorized'
import Loader from '../../components/loader'

const styles = {
  coinBox: {
    marginBottom: "20px",
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
  },
  button : {
    width: "100%",
    height: "40px",
    backgroundColor: "#ff0000",
    color: "black",
    marginTop: "15px"
  }

}

//Sum all coin transactions
const countCoinSum = (transactions, coin, currencyRate) => {
  const findTransactions = transactions.filter((tran) => tran.coin === coin?.name)
  const sumCoinTransactions = findTransactions.reduce((pv, tran) => pv + (tran.price * tran.quantity), 0) * currencyRate
  return [sumCoinTransactions, findTransactions]
}

  

const PortfolioCoinPage = () => {
  console.log("render");
  const { watchlist, currency, transactions, currencyRate, symbol, coins, user, setAlert, loading} = CryptoState();
  const [coin, setCoin] = useState();
  const [page, setPage] = useState(5);
  const { id } = useParams();

  const history = useHistory();

  const fetchCoin = async () => {
    const res = await fetch(SingleCoin(id))
    res.json().then(data => setCoin(data))
  }

  useEffect(() => {
    fetchCoin();
    console.log("fetch");
  }, [currency]);

  

  const coinInPortfolio = watchlist.filter((watch) => watch.coin === coin?.name);
  //Total sum of this coin i portfolio
  const actualTotalSum = coinInPortfolio[0]?.quantity * (coin?.market_data.current_price['usd'] * currencyRate);

  const findPartOfPortfolio = () => {
    const total = countTotalSum(findPortfolio(watchlist, coins), currencyRate);
    console.log(watchlist);
    console.log(coins);
    const res = (actualTotalSum / total) * 100 ;
    return res;
  };

  const [sumCoinTransactions, findTransactions] = countCoinSum(transactions, coin, currencyRate);
  //Percentage change this coin in portfolio
  const countCoinChangePercentage = (1 - ((coinInPortfolio[0]?.quantity * coinInPortfolio[0]?.midPrice * currencyRate) / actualTotalSum)) * 100;

  const deleteCoin = async () => {
    const newPortfolio = watchlist.filter((item) => item.id !== coin.id);
    const newTransactions = transactions.filter((item) => item.id !== coin.id);

    const coinRef = doc(db, user?.uid, "portfolio");

    try {
      await setDoc(coinRef,{
          coins: newPortfolio,
          transactions: newTransactions
        });
        setAlert({
          open: true,
          message: `${coin.name} deleted from Portfolio`,
          type: "success"
      });
      history.push('/portfolio');
    } catch(error) {
      setAlert({
        open: true,
        message: error,
        type: "error"
      });
    }
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark"
    },
  });

  if(loading) {
    return <Loader />
  }

  if(!user) {
    return (
      <NotAutorized />
    )
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container sx={styles.container}>
          <div style={{padding: "15px", width: "40%"}}>
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
                  {symbol} {numberWithCommas(actualTotalSum.toFixed(2))}
                </span>
                <span style={{ textAlign: "left"}}>
                  {coinInPortfolio[0]?.quantity.toFixed(4)} {coin?.symbol.toUpperCase()}
                </span>
              </div>
              <div>
                <span style={{...styles.changes, backgroundColor: coin?.market_data.price_change_percentage_24h > 0 ? "rgba(0, 255, 0, 0.3)" : "rgba(212, 8, 8, 0.3)"}}>{coin?.market_data.price_change_percentage_24h.toFixed(2)}%</span>
              </div>
            </Box>
            <Box sx={styles.coinBox}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "darkgrey", marginBottom: "7px" }}>Part of Portfolio</span>
                <span>{findPartOfPortfolio().toFixed(2)}%</span>
              </div>
            </Box>
            <Box sx={styles.coinBox}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "darkgrey", marginBottom: "7px" }}>Current Price</span>
                <span>{symbol} {coin?.market_data.current_price[currency.toLowerCase()].toFixed(2)}</span>
              </div>
            </Box>
            <Box sx={styles.coinBox}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid darkgrey", borderRadius: "50%", width: "35px", height: "35px", marginBottom: "10px"}}>
                  <span style={{color: "darkgrey", fontSize: "20px", fontWeight: "700"}}>
                    {symbol}
                  </span>
                </div>
                <span style={{ color: "darkgrey", marginBottom: "7px" }}>Total Profit/Lose</span>
                <span>{numberWithCommas((actualTotalSum - (coinInPortfolio[0]?.quantity * coinInPortfolio[0]?.midPrice * currencyRate)).toFixed(2))} {symbol}</span>
              </div>
              <div>
                  <span style={{...styles.changes, backgroundColor: countCoinChangePercentage > 0 ? "rgba(0, 255, 0, 0.3)" : "rgba(212, 8, 8, 0.3)"}}>{countCoinChangePercentage.toFixed(2)}%</span>
              </div>
            </Box>
            <TradeWindow coin ={coin}/>
            <Button sx={styles.button} onClick={deleteCoin}>
              Delete
            </Button>
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
                {findTransactions.reverse().slice(0, page).map((row) => (
                  <TableRow
                    key={row.date}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <div style={{display: "flex", alignItems: "center"}}>
                      <BsFillArrowDownCircleFill color={row.quantity > 0 ? "green" : "red"} />
                      <div style={{display: "flex", flexDirection: "column", marginLeft: "6px"}}>
                        <span>{row.quantity > 0 ? "Buy" : "Sell"}</span>
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
            {findTransactions.length > 5 && page < findTransactions.length && <Button variant="outlined"
                                              onClick={() => setPage((page) => page + 5)} >
                                              Next Transactions  
                                            </Button>}
            {page > 5 && <Button variant="outlined"
                            onClick={() => setPage(5)}>
                            Hide All
                         </Button>}
          </TableContainer>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default PortfolioCoinPage