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
        title: {
          display: true,
          text: "COVID-19 Cases of Last 3 Months",
          fontSize: 15,
          
        }, 
        maintainAspectRatio: false ,
        legend: {
          display: true, //Is the legend shown?
          position: "right" //Position of the legend.
        }
      }}
      data={pieChartData}
    />
  )
}

export default PieChart