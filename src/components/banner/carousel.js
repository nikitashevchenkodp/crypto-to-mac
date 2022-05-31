import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import { Link } from 'react-router-dom'
import { TrendingCoins } from '../../config/api'
import { CryptoState } from '../../crypto-context'

const Carousel = () => {
  const [trending, setTrending] = useState([])
  const { currency, symbol } = CryptoState()

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const classes = {
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center"
    },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
    },
    price: {
      fontSize: "22px",
      fontWeight: "500"
    }
  }

  useEffect(() => {
    fetchTrendingCoins()
  }, [currency])

  const fetchTrendingCoins = async () => {
    const res = await fetch(TrendingCoins(currency))
    res.json().then(data => setTrending(data))
    
  }

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0

    return (
      <Link 
      style={classes.carouselItem}
      to={`/coins/${coin.id}`}>
        <img
          src={coin.image}
          alt={coin.name}
          height="80"
          style={{marginBottom: 10}} 
           />
           <span>
             {coin?.symbol}
             &nbsp;
             <span
              style={{
                color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                fontWeight: 500,
              }}>
              {profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%
             </span>
           </span>
           <span style = {classes.price}>
             {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
           </span>
      </Link>
    )
  })

  const responsive = {
    0: {
      items: 2
    },
    512: {
      items: 4
    }
  };

  return (
    <div style={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  )
}

export default Carousel