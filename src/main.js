import LocationCostWrapperView from './view/locationCostWrapper.js';
import LocationInfoView from './view/locationInfo.js';
import CostInfoView from './view/costInfo.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import BoardView from './presenter/board.js';
import {generateTripPoint} from './mock/tripPoint.js';
import {render, RenderPosition} from "./utils/render.js";

const MAX_TRIPS = 19;

const tripPointsData = new Array(MAX_TRIPS)
  .fill()
  .map(generateTripPoint)
  .sort((a, b) => a.date.start - b.date.start);

const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

const locationCostWrapperComponent = new LocationCostWrapperView();
render(tripInfo, locationCostWrapperComponent, RenderPosition.AFTERBEGIN);

if (tripPointsData.length > 0) {
  render(locationCostWrapperComponent, new LocationInfoView(tripPointsData), RenderPosition.AFTERBEGIN);
  render(locationCostWrapperComponent, new CostInfoView(tripPointsData), RenderPosition.BEFOREEND);
}

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

const menuComponent = new MenuView();
render(menuFilterFirstTitle, menuComponent, RenderPosition.AFTEREND);
const filterComponent = new FilterView();
render(menuFilterWrapper, filterComponent, RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

const boardComponent = new BoardView(allEvents);

boardComponent.init(tripPointsData);

