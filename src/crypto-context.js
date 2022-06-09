import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { CoinList } from './config/api';
import CurrencyApiService from './config/curency-api-service';
import { auth, db } from './firebase';


const Crypto = createContext();

const CryptoContext = ({children}) => {
  const currencyApi = new CurrencyApiService();
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success"
  });
  console.log("render");
  const [watchlist, setWatchlist] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currencyRate, setCurrencyRate] = useState(1);

  

  useEffect(() => {
    
    if(user) {
      setLoading(true)
      const coinRef = doc(db, user?.uid, "portfolio");
      var unsubscribe = onSnapshot(coinRef, coin => {
        if(coin.exists()) {
          console.log(coin.data().coins);
          setWatchlist(coin.data().coins);
          setLoading(false);
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
          setTransactions(trans.data().transactions);
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
    setLoading(true)
    onAuthStateChanged(auth, user => {
      if(user) {
        setUser(user);
        setLoading(false)
      } 
      else setUser(null);
    })
 
  }, []);

  useEffect(() => {
    if(currency === "USD") {
      setCurrencyRate(1);
      setSymbol("$");
    } else if(currency === "UAH") {
        currencyApi.getCurrency(currency)
        .then(res => setCurrencyRate(res[`USD${currency}`]));
        setSymbol("₴")
    }  
    
  }, [currency]);


  const fetchCoins = async () => {
    const res = await fetch(CoinList("USD"));
    res.json().then(data => setCoins(data));
    setLoading(false)
  }

  return (
    <Crypto.Provider value = {{currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist, transactions, currencyRate}}>
      {children}
    </Crypto.Provider>
  )
}

export default CryptoContext


export const CryptoState = () => {
  return useContext(Crypto)
}