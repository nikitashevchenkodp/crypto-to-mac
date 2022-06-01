
export const countMidPrice = (transactions,lastTransaction, coin) => {
    const findCoins = transactions.filter((tran) => tran.coin === coin.name)
    const totSum = [...findCoins, lastTransaction].reduce((pv, tran) => pv + tran.price * tran.quantity ,0)
    const totQuantity = [...findCoins, lastTransaction].reduce((pv,tran) => pv + tran.quantity, 0)
    const midPrice = totSum / totQuantity

    return midPrice
}

