import LocationCostWrapperView from './view/locationCostWrapper.js';
import LocationInfoView from './view/locationInfo.js';
import CostInfoView from './view/costInfo.js';
import MenuView from './view/menu.js';
import BoardView from './presenter/board.js';
import FilterView from './presenter/filter.js';
import {generateTripPoint, generateOffer, destination} from './mock/tripPoint.js';
import {render, RenderPosition} from "./utils/render.js";
import PointsModel from "./models/points.js";
import FiltersModel from "./models/filter.js";

const MAX_TRIPS = 15;

const tripPointsData = new Array(MAX_TRIPS)
  .fill()
  .map(generateTripPoint)
  .sort((a, b) => a.dateFrom - b.dateTo);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPointsData);

const filterModel = new FiltersModel();

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
const filterPresenter = new FilterView(menuFilterWrapper, filterModel, pointsModel);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

const boardComponent = new BoardView(allEvents, pointsModel, filterModel);

filterPresenter.init();
boardComponent.init();

