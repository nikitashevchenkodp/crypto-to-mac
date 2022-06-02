
export const countMidPrice = (transactions,lastTransaction, coin) => {
    const findCoins = transactions.filter((tran) => tran.coin === coin.name)
    const totSum = [...findCoins, lastTransaction].reduce((pv, tran) => pv + tran.price * tran.quantity ,0)
    const totQuantity = [...findCoins, lastTransaction].reduce((pv,tran) => pv + tran.quantity, 0)
    const midPrice = totSum / totQuantity

    return midPrice
}

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
  
  export const countTotalSum = (portfolio) => {
    const res = portfolio?.reduce((pv, port) => pv + (port.current_price * port.quantity), 0)
    return res
  }
  
  export const countPercentageChange = (transactions, portfolio, currencyRate) => {
    const sumAllTransactions = transactions.reduce((pv, tran) => pv + (tran.price * tran.quantity), 0) * currencyRate
    const sumPortfolio = countTotalSum(portfolio)
    const percentage = ((sumPortfolio / sumAllTransactions) - 1) * 100
    const different = sumPortfolio - sumAllTransactions
    return [percentage, different]
  }