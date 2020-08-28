import LocationCostWrapperView from './view/locationCostWrapper.js';
import LocationInfoView from './view/locationInfo.js';
import CostInfoView from './view/costInfo.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import EventAdderView from './view/eventAdder.js';
import TripDaysListView from './view/tripDaysList.js';
import TripDayView from './view/tripDay.js';
import TripPointsListView from './view/tripPointsList.js';
import {generateTripPoint} from './mock/tripPoint.js';
import {getSetDates} from "./utils.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

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

renderElement(tripInfo, new LocationCostWrapperView().getElement(), RenderPosition.AFTERBEGIN);

const locationWrapper = tripInfo.querySelector(`.trip-main__trip-info`);

renderElement(locationWrapper, new LocationInfoView(tripPointsData).getElement(), RenderPosition.AFTERBEGIN);
renderElement(locationWrapper, new CostInfoView(tripPointsData).getElement(), RenderPosition.BEFOREEND);

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

renderElement(menuFilterFirstTitle, new MenuView().getElement(), RenderPosition.AFTEREND);
renderElement(menuFilterWrapper, new FilterView().getElement(), RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

renderElement(allEvents, new SortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(allEvents, new EventAdderView(tripPointsData[0]).getElement(), RenderPosition.BEFOREEND);
renderElement(allEvents, new TripDaysListView().getElement(), RenderPosition.BEFOREEND);

const tripDaysList = allEvents.querySelector(`.trip-days`);

getSetDates(tripPointsData).forEach((date, index) => {
  const normalDate = new Date(date);
  const filtredData = tripPointsData.filter((dataItem) => {
    return dataItem.date.start.toDateString() === normalDate.toDateString();
  });

  renderElement(tripDaysList, new TripDayView(normalDate, filtredData, index).getElement(), RenderPosition.BEFOREEND);
});

const tripDay = tripDaysList.querySelector(`.trip-days__item`);

renderElement(tripDay, new TripPointsListView().getElement(), RenderPosition.BEFOREEND);

