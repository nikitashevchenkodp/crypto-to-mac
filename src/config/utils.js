
export const countMidPrice = (transactions,lastTransaction, coin) => {
    const findCoinTransactions = transactions.filter((tran) => tran.coin === coin.name)
    const totalSumTransactions = [...findCoinTransactions, lastTransaction].reduce((pv, tran) => pv + tran.price * tran.quantity ,0)
    const totalCoinQuantity = [...findCoinTransactions, lastTransaction].reduce((pv,tran) => pv + tran.quantity, 0)
    const midPrice = totalSumTransactions / totalCoinQuantity

    return midPrice
}

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //Give coins in portfolio current price aand other data
  export const findPortfolio = (watchlist, coins) => {
    let res = []
    for (let i = 0; i < coins.length; i++) {
      for (let j = 0; j < watchlist.length; j++) {
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
  
  export const countTotalSum = (portfolio, currencyRate) => {
    const res = portfolio?.reduce((pv, port) => pv + (port.current_price * currencyRate * port.quantity), 0)
    return res
  }
  
  export const countPercentageChange = (transactions, portfolio, currencyRate) => {
    const sumAllTransactions = transactions.reduce((pv, tran) => pv + (tran.price * tran.quantity), 0) * currencyRate
    const sumPortfolio = countTotalSum(portfolio, currencyRate)
    const percentage = ((sumPortfolio / sumAllTransactions) - 1) * 100
    const different = sumPortfolio - sumAllTransactions
    console.log(sumPortfolio);
    console.log(sumAllTransactions);
    return [percentage, different]
  }

  export const calculationsPie = (portfolio, currencyRate) => {
    const labels = portfolio.map((port) => port.symbol.toUpperCase())
    const totalSumOfCoin = portfolio.map((port) => port.quantity * port.current_price * currencyRate)
    const totalSumPortfolio = totalSumOfCoin.reduce((pv, sum) => pv + sum, 0)
    const partInPortfolio = totalSumOfCoin.map((coin) => (coin / totalSumPortfolio ) * 100)
    return [labels, partInPortfolio]
    
}

export const randomColor = (labels) => {
  let colors = []
  for(let i = 0; i < labels.length; i++) {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      let color = "rgb(" + r + "," + g + "," + b + ")";
      colors.push(color)
  }
  return colors
}