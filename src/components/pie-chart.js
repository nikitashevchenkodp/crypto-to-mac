import React from 'react'
import { Pie } from 'react-chartjs-2'
import {Chart, registerables} from 'chart.js'
import { CryptoState } from '../crypto-context';
import { calculationsPie, findPortfolio, randomColor } from '../config/utils';
Chart.register(...registerables);

const PieChart = () => {
    const {watchlist, coins, currencyRate} = CryptoState()

    const portfolio = findPortfolio(watchlist, coins)

    const [labels, partInPortfolio] = calculationsPie(portfolio, currencyRate)
    

    const pieChartData = {
        labels: labels,
        datasets: [{
            data: partInPortfolio,
            label: "Infected People",
            backgroundColor: randomColor(labels),
            hoverBackgroundColor: ["#175000", "#003350", "#993d00"]
        }]
      };

  return (
    <Pie
      type="pie"
      width={130}
      height={50}
      options={{
        animation: {
          animateScale: true
        } ,
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Part of each coin in Your Portfolio",
            fontSize: 15,
          },
          legend: {
            display: true, 
            position: "top",
            align: 'center',
          }
        },
        maintainAspectRatio: false ,
      }}
      data={pieChartData}
    />
  )
}

export default PieChart