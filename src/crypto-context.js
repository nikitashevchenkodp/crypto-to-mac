import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { createContext } from 'react'
import { CoinList } from './config/api'
import CurrencyApiService from './config/curency-api-service'
import { auth, db } from './firebase'


const Crypto = createContext()

const CryptoContext = ({children}) => {
  const currencyApi = new CurrencyApiService()
  const [currency, setCurrency] = useState("USD")
  const [symbol, setSymbol] = useState("$")
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success"
  })

  const [watchlist, setWatchlist] = useState([])
  const [transactions, setTransactions] = useState([])
  const [currencyRate, setCurrencyRate] = useState(1)
  const [findRate, setFindRate] = useState(1)
  

  useEffect(() => {
    if(user) {
      const coinRef = doc(db, user?.uid, "portfolio");
      var unsubscribe = onSnapshot(coinRef, coin => {
        if(coin.exists()) {
          console.log(coin.data().coins);
          setWatchlist(coin.data().coins)
        } else {
          console.log("No items in te watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }

    
  }, [user]);

  useEffect(() => {
    if(user) {
      const coinRef = doc(db, user?.uid, "portfolio");
      var unsubscribe = onSnapshot(coinRef, trans => {
        if(trans.exists()) {
          console.log(trans.data().transactions);
          setTransactions(trans.data().transactions)
        } else {
          console.log("Transactions list is empty");
        }
      });

      return () => {
        unsubscribe();
      };
    }

    
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if(user) setUser(user)
      else setUser(null)
    })
  }, [])

  useEffect(() => {
    fetchCoins()
    currencyApi.getCurrency(currency)
        .then(res => setCurrencyRate(res[`USD${currency}`]))
  }, [currency])


  const fetchCoins = async () => {
    setLoading(true)
    const res = await fetch(CoinList(currency))
    res.json().then(data => setCoins(data))
    setLoading(false)
  }


  useEffect(() => {
    if(currency === "USD") setSymbol("$")
    else if(currency === "UAH") setSymbol("₴")
  }, [currency])

  return (
    <Crypto.Provider value = {{currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist, transactions, currencyRate, setFindRate, findRate}}>
      {children}
    </Crypto.Provider>
  )
}

export default CryptoContext


export const CryptoState = () => {
  return useContext(Crypto)
}