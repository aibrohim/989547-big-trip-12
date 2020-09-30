import LocationCostWrapperView from "./view/location-cost-wrapper.js";
import MenuView from "./view/menu.js";
import BoardView from "./presenter/board.js";
import FilterView from "./presenter/filter.js";
import LocationCost from "./presenter/location-cost.js";
import {generateTripPoint} from "./mock/trip-point.js";
import {render, RenderPosition} from "./utils/render.js";
import PointsModel from "./models/points.js";
import FiltersModel from "./models/filter.js";
import OffersModel from "./models/offers.js";
import offersMocks from "./mock/offers.js";
import Statistics from "./view/statistics.js";
import {MenuItem} from "./consts.js";
import {remove} from "./utils/render.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic ib99ali`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const MAX_TRIPS = 15;

const tripPointsData = new Array(MAX_TRIPS)
  .fill()
  .map(generateTripPoint)
  .sort((a, b) => a.dateFrom - b.dateTo);

const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((points) => {
  console.log(points);
});

api.getDestinations().then((destinations) => {
  console.log(destinations);
});

api.getOffers().then((offers) => {
  console.log(offers);
});

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPointsData);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

const offersModel = new OffersModel();
const offersArray = Array.from(Object.values(offersMocks));
offersModel.setOffers(offersArray);

const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

const filterModel = new FiltersModel();
const boardPresenter = new BoardView(allEvents, pointsModel, filterModel, offersModel);

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
const statsComponent = new Statistics(pointsModel.getPoints());

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      if (statsComponent) {
        remove(statsComponent);
      }
      boardPresenter.init();
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      render(allEvents, statsComponent, RenderPosition.AFTEREND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});

