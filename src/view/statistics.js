import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import moment from "moment";

import {EVENT_ACTION, typeToEmoji} from "../consts.js";
import AbstractView from "./abstract.js";
import {capitalizeFirstLetter} from "../utils/common.js";

const BAR_HEIGHT = 45;
const ChartType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`,
};

const renderChart = (chartCtx, chartType, events) => {
  let chartFormat = ``;
  const chartData = {};

  const filteredEvents = events
    .slice()
    .filter((event) => {
      const type = capitalizeFirstLetter(event.type);
      return Object.values(EVENT_ACTION.types).includes(type);
    });

  const isTransport = chartType === ChartType.TRANSPORT ? filteredEvents : events;

  isTransport.forEach((event) => {
    const eventType = event.type.toUpperCase();

    if (!chartData[eventType]) {
      chartData[eventType] = {
        eventType,
        number: 0
      };
    }

    switch (chartType) {
      case ChartType.MONEY:
        chartData[eventType].number += event.price;
        break;
      case ChartType.TRANSPORT:
        chartFormat = `x`;
        chartData[eventType].number++;
        break;
      case ChartType.TIME_SPENT:
        const startMoment = moment(event.startDate);
        const finishMoment = moment(event.endDate);
        const timeDiff = moment.duration(finishMoment.diff(startMoment));
        const millisecondsHours = 3600000;

        chartFormat = `H`;
        chartData[eventType].number += Math.round(timeDiff / millisecondsHours);
        break;
    }
  });

  const sortedData = Object.entries(chartData).sort((a, b) => {
    return b[1].number - a[1].number;
  });

  chartCtx.height = BAR_HEIGHT * Object.keys(chartData).length;

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: sortedData.map((data) => `${typeToEmoji[data[0]]} ${data[0]}`),
      datasets: [{
        data: sortedData.map((data) => data[1].number),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${chartType === ChartType.MONEY ? `€` : ``} ${val}${chartFormat}`
        }
      },
      title: {
        display: true,
        text: chartType,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

export default class Stats extends AbstractView {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendCtx = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderChart(moneyCtx, ChartType.MONEY, this._events);
    this._transportChart = renderChart(transportCtx, ChartType.TRANSPORT, this._events);
    this._timeSpendCtx = renderChart(timeSpendCtx, ChartType.TIME_SPENT, this._events);
  }
}

