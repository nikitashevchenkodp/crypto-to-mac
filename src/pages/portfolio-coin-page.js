import { Container, createTheme, ThemeProvider } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SingleCoin } from '../config/api'
import CurrencyApiService from '../config/curency-api-service'
import { CryptoState } from '../crypto-context'

const PortfolioCoinPage = () => {

  const {watchlist, coins, currency} = CryptoState()
  const [coin, setCoin] = useState(null)
  console.log(coin);
  const {id} = useParams()

  const fetchCoin = async () => {
    const res = await fetch(SingleCoin(id))
    res.json().then(data => setCoin(data))
  }

  useEffect(() => {
    fetchCoin()
  }, [])

  const coinInPortfolio = watchlist.filter((watch) => watch.coin === coin.name)  
  console.log(coinInPortfolio);

  const styles = {
    main: {

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

  return (
    <>
      <ThemeProvider theme = {darkTheme}>
        <Container>
          <Box>
            HelLo {coin?.name}
            <img src={coin?.image.small} />
            Current price {coin?.market_data.current_price[currency.toLowerCase()]}
            Quantity in portfolio {coinInPortfolio[0]?.quantity}
          </Box>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default PortfolioCoinPage