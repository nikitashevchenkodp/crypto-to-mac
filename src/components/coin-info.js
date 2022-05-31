import React from 'react'
import { useState } from 'react'
import {CryptoState} from "../crypto-context"
import {HistoricalChart} from "../config/api"
import { useEffect } from 'react'
import { createTheme, ThemeProvider, styled, CircularProgress } from '@mui/material'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { chartDays } from '../config/data'
import SelectButton from './select-button'

const CoinInfo = ({coin}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [historicData, setHistoricalData] = useState([])
  const [days, setDays] = useState(1)

  const {currency} = CryptoState()

  const fetchHistoricalData = async () => {
    const res = await fetch(HistoricalChart(coin.id, days, currency))
    res.json().then(data => setHistoricalData(data.prices))
  }

  useEffect(() => {
    fetchHistoricalData()
  },[currency, days])


  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode:"dark"
    },
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <MainRoot>
        {
          !historicData ? (
            <CircularProgress
              sx={{color: "gold"}}
              size={250}
              thickness={1} />
          ) : (
            <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time = `${date.getHours()}:${date.getMinutes()}`
                      
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div style={{
              display: "flex",
              marginTop: "20px",
              justifyContent: "space-around",
              width: "100%"
            }}>
              {chartDays.map(day => (
                <SelectButton 
                  key={day.value}
                  onClick = {() => setDays(day.value)}
                  selected = {day.value === days}
                  >
                  {day.label}
                </SelectButton>
              ))}
            </div>
            </>
          )
        }
      </MainRoot>
    </ThemeProvider>
  )
}

const MainRoot = styled('div')(({theme}) => ({
  width: "75%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "25px",
  padding: "40px",
  [theme.breakpoints.down("md")] : {
    width: "100%",
    marginTop: "0",
    padding: "20px",
    paddingTop: "0"
  }
}))

export default CoinInfo