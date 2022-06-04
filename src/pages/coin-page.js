import { LinearProgress, styled, Typography, Button } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CoinInfo from '../components/coin-info'
import { SingleCoin } from '../config/api'
import { CryptoState } from '../crypto-context'
import {doc, setDoc} from 'firebase/firestore'
import { db } from '../firebase'
import TradeWindow from '../components/trade/trade-window'


const CoinPage = () => {

  const {id} = useParams()
  const {symbol, currency, user, watchlist, setAlert, currencyRate} = CryptoState()
  const [coin, setCoin] = useState()
  const [loading, setLoading] = useState(false)

  const fetchCoin = async () => {
    const res = await fetch(SingleCoin(id))
    res.json().then(data => setCoin(data))
  }
  const inWatchList = true



  const addToWatchlist = async () => {
    const coinRef = doc(db, user?.uid, "portfolio");
    try{
      await setDoc(coinRef,
        {coins: watchlist ? [...watchlist, coin] : [coin]})

        setAlert({
          open: true,
          message: `${coin.name} Added to the Watchlist`,
          type: "success"
        })
    } catch(error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      })
    }

  }

  const removeFromWatchList = async () => {
    const coinRef = doc(db, user?.uid, "portfolio");

    try{
      await setDoc(coinRef,
        {coins: watchlist.filter((watch) => watch !== coin?.id ) },
        {merge: true})

        setAlert({
          open: true,
          message: `${coin.name} Remover from the Watchlist`,
          type: "success"
        })
    } catch(error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      })
    }

  }

  useEffect(() => {
    fetchCoin()
  }, [])

  const classes = {
    heading: {
      fontWeight: "bold",
      marginBottom: "20px",
      fontFamily: "Montserrat"
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: "25px",
      paddingBottom: "15px",
      paddingTop: "0",
      textAlign: "justify"
    },
    addButton: {
      width: "100%",
      height: "40px",
      backgroundColor: inWatchList? "#ff0000" : "#EEBC1D",
      color: "black",
    }
  }

  const cutTegs = (str) => {
    let regex = /( |<([^>]+)>)/ig,
        result = str.replace(regex, " ");
   
        return result;
  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if(!coin) return <LinearProgress sx={{backgroundColor: "gold"}} />

  return (
    <MainRoot>
      <SideBar>
        <img 
          src={coin?.image.large}
          alt = {coin?.name}
          height = "200"
          style = {{marginBottom: "20px"}}
        />
        <Typography
          variant='h3'
          sx = {classes.heading}
          >
          {coin?.name}
        </Typography>
        <Typography variant='subtitle1' sx={classes.description}>
          {cutTegs(coin?.description.en.split(". ")[0])}
        </Typography>
        <MarketData>

          <span style={{display: "flex"}}>
            <Typography variant='h5'sx = {classes.heading}>
              Rank:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant='h5' sx={{fontFamily: "Montserrat"}}>
              {coin?.market_cap_rank}
            </Typography>
          </span>

          <span style={{display: "flex"}}>
            <Typography variant='h5'sx = {classes.heading}>
            Current Price:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant='h5' sx={{fontFamily: "Montserrat"}}>
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.current_price['usd'] * currencyRate)}
            </Typography>
          </span>

          <span style={{display: "flex"}}>
            <Typography variant='h5'sx = {classes.heading}>
              Market Cap:{" "}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant='h5' sx={{fontFamily: "Montserrat"}}>
              {symbol}{" "}
              {numberWithCommas((coin?.market_data.market_cap['usd'] * currencyRate)
                                .toString().slice(0, -6))}
              M
            </Typography>
          </span>
          {user && 
            <TradeWindow coin ={coin}/>
          }
        </MarketData>
      </SideBar>
      <CoinInfo coin = {coin} />
    </MainRoot>
  )
}


const MainRoot = styled('div')(({theme}) => ({
  display: "flex",
  [theme.breakpoints.down("md")] : {
    flexDirection: "column",
    alignItems: "center"
  }
}))

const SideBar = styled('div')(({theme}) => ({
  width: "30%",
  [theme.breakpoints.down("md")] : {
    width: "100%"
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "25px",
  borderRight: "2px solid grey"
}))

const MarketData = styled('div')(({theme}) => ({
  alignSelf: "start",
  padding: "25px",
  paddingTop: "10px",
  width: "100%",
  [theme.breakpoints.down('sm')]: {
    flexDirection: "column",
    alignItems: "center"
  },
  [theme.breakpoints.down('md')]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  [theme.breakpoints.down('xs')]: {
    alignItems: "start"
  }
}))



export default CoinPage