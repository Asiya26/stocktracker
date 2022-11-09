import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { db } from '../firebase/firebase';
import { ref, set, push, onValue } from 'firebase/database';

const API_KEY = process.env.REACT_APP_API_KEY;

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [stockData, setStockData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [fav, setFav] = useState([]);
  const [isClickedFav, setIsClickedFav] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [priceLevel, setPriceLevel] = useState();

  const fetchData = (ticker) => {
    const options = {
      method: 'GET',
      url: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&apikey=${API_KEY}`,
    };
    axios
      .request(options)
      .then(function (res) {
        if (res?.data['Time Series (60min)'])
          addStockData(ticker, res?.data['Time Series (60min)']);
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  const handleTimer = () => {
    fav.forEach((item) => {
      fetchData(item.identifier);
    });
  };

  useEffect(() => {
    let id;
    if (isAlert) {
      id = setInterval(handleTimer, 60000);
    }
    return () => clearInterval(id);
  }, [isAlert]);

  const addStockData = (tickerName, data) => {
    const ticker = tickerName.toUpperCase();
    const keys = Object.keys(data);
    const recent = data[keys[0]];
    const newStock = {
      identifier: ticker,
      open: recent['1. open'],
      dayHigh: recent['2. high'],
      dayLow: recent['3. low'],
      lastPrice: recent['4. close'],
      volume: recent['5. volume'],
      lastUpdateTime: keys[0],
      pChange: (
        ((recent['4. close'] - data[keys[12]]['4. close']) /
          data[keys[12]]['4. close']) *
        100
      ).toFixed(2),
    };
    console.log(newStock);
    const pos = stockData.findIndex((item) => item.identifier === ticker);
    if (pos === -1) {
      setStockData([...stockData, newStock]);
      setHistoryData([...historyData, ticker]);
    } else {
      const newStockData = [...stockData];
      newStockData[pos] = newStock;
      setStockData(newStockData);
    }
    const posFav = fav.findIndex((item) => item.identifier === ticker);
    if (posFav !== -1 && newStock) {
      const newFav = [...fav];
      newFav[pos] = {
        ...newStock,
        alertPrice: newFav[pos]?.alertPrice,
        check: newFav[pos]?.check,
      };
      if (newFav[pos].identifier === 'IBM') newFav[pos].lastPrice = 145;
      if (newFav[pos].identifier === 'BABA') newFav[pos].lastPrice = 65;
      setFav(newFav);
    }
  };

  // FIREBASE OPS
  const saveToDatabase = (item) => {
    const postRef = ref(db, 'Favs');
    const newPostRef = push(postRef);
    console.log(item);
    set(newPostRef, {
      ...item,
    });
  };

  useEffect(() => {
    const postRef = ref(db, 'Favs');
    onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      const postArr = [];
      for (let id in data) {
        postArr.push({ id, ...data[id] });
      }
      setFav(postArr);
      console.log(postArr);
    });
  }, []);

  return (
    <Context.Provider
      value={{
        stockData,
        setStockData,
        addStockData,
        historyData,
        setHistoryData,
        fetchData,
        setFav,
        fav,
        setIsClickedFav,
        isClickedFav,
        isAlert,
        setIsAlert,
        saveToDatabase,
        setPriceLevel,
        priceLevel,
      }}
    >
      {children}
    </Context.Provider>
  );
};
