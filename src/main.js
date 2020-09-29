import LocationCostWrapperView from './view/locationCostWrapper.js';
import MenuView from './view/menu.js';
import BoardView from './presenter/board.js';
import FilterView from './presenter/filter.js';
import LocationCost from './presenter/locationCost.js';
import {generateTripPoint} from './mock/tripPoint.js';
import {render, RenderPosition} from "./utils/render.js";
import PointsModel from "./models/points.js";
import FiltersModel from "./models/filter.js";
import OffersModel from "./models/offers.js";
import offersMocks from "./mock/offers.js";
import {MenuItem} from "./consts.js";

const MAX_TRIPS = 15;

const tripPointsData = new Array(MAX_TRIPS)
  .fill()
  .map(generateTripPoint)
  .sort((a, b) => a.dateFrom - b.dateTo);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPointsData);

const filterModel = new FiltersModel();

const offersModel = new OffersModel();
const offersArray = Array.from(Object.values(offersMocks));
offersModel.setOffers(offersArray);

const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

const locationCostWrapperComponent = new LocationCostWrapperView();
render(tripInfo, locationCostWrapperComponent, RenderPosition.AFTERBEGIN);

if (tripPointsData.length > 0) {
  const locationCost = new LocationCost(locationCostWrapperComponent, pointsModel);
  locationCost.init();
}

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

const menuComponent = new MenuView();
render(menuFilterFirstTitle, menuComponent, RenderPosition.AFTEREND);
const filterPresenter = new FilterView(menuFilterWrapper, filterModel, pointsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TASKS:
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      // Скрыть доску
      // Показать статистику
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

const boardComponent = new BoardView(allEvents, pointsModel, filterModel, offersModel);

filterPresenter.init();
boardComponent.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardComponent.createPoint();
});

