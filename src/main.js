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
import {createTripPoint} from './view/tripPoint';
import {generateTripPoint} from './mock/tripPoint.js';

const MAX_TRIPS = 20;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

render(tripInfo, createLocationCostWrapper(), `afterbegin`);

const locationWrapper = tripInfo.querySelector(`.trip-main__trip-info`);

render(locationWrapper, createLocationInfo(), `afterbegin`);
render(locationWrapper, createCostInfo(), `beforeend`);

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

render(menuFilterFirstTitle, createMenu(), `afterend`);
render(menuFilterWrapper, createFilter(), `beforeend`);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

render(allEvents, createSort(), `beforeend`);
render(allEvents, createAddEvent(), `beforeend`);
render(allEvents, createTripDaysList(), `beforeend`);

const tripDaysList = allEvents.querySelector(`.trip-days`);

render(tripDaysList, createTripDay(), `beforeend`);

const tripDay = tripDaysList.querySelector(`.trip-days__item`);

render(tripDay, createTripPointsList(), `beforeend`);

const tripPointsList = tripDay.querySelector(`.trip-events__list`);

const tripPointsData = new Array(MAX_TRIPS).fill().map(generateTripPoint);

for (let i = 0; i < MAX_TRIPS; i++) {
  render(tripPointsList, createTripPoint(tripPointsData[i]), `afterbegin`);
}

console.log(tripPointsData);
