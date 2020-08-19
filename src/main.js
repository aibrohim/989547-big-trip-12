import {createLocationCostWrapper} from './view/locationCostWrapper.js';
import {createLocationInfo} from './view/locationInfo.js';
import {createCostInfo} from './view/costInfo.js';
import {createMenu} from './view/menu.js';
import {createFilter} from './view/filter.js';
import {createSort} from './view/sort.js';
import {createAddEvent} from './view/eventAdder.js';
import {createTripDaysList} from './view/tripDaysList.js';
import {createTripDay} from './view/tripDay.js';
import {createTripPointsList} from './view/tripPointsList.js';
import {generateTripPoint} from './mock/tripPoint.js';
import {getSetDates} from "./utils.js";
import {AFTERBEGIN} from "./consts.js";
import {BEFOREEND} from "./consts.js";
import {AFTEREND} from "./consts.js";

const MAX_TRIPS = 18;

const tripPointsData = new Array(MAX_TRIPS)
  .fill()
  .map(generateTripPoint)
  .sort((a, b) => a.date.start - b.date.start);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

render(tripInfo, createLocationCostWrapper(), AFTERBEGIN);

const locationWrapper = tripInfo.querySelector(`.trip-main__trip-info`);

render(locationWrapper, createLocationInfo(tripPointsData), AFTERBEGIN);
render(locationWrapper, createCostInfo(tripPointsData), BEFOREEND);

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

render(menuFilterFirstTitle, createMenu(), AFTEREND);
render(menuFilterWrapper, createFilter(), BEFOREEND);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

render(allEvents, createSort(), BEFOREEND);
render(allEvents, createAddEvent(tripPointsData[0]), BEFOREEND);
render(allEvents, createTripDaysList(), BEFOREEND);

const tripDaysList = allEvents.querySelector(`.trip-days`);

getSetDates(tripPointsData).forEach((date, index) => {
  const normalDate = new Date(date);
  const filtredData = tripPointsData.filter((dataItem) => {
    return dataItem.date.start.toDateString() === normalDate.toDateString();
  });

  render(tripDaysList, createTripDay(normalDate, filtredData, index), BEFOREEND);
});

const tripDay = tripDaysList.querySelector(`.trip-days__item`);

render(tripDay, createTripPointsList(), BEFOREEND);

