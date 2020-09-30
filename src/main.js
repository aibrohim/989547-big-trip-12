import LocationCostWrapperView from "./view/location-cost-wrapper.js";
import MenuView from "./view/menu.js";
import BoardView from "./presenter/board.js";
import FilterView from "./presenter/filter.js";
import LocationCost from "./presenter/location-cost.js";
import {render, RenderPosition} from "./utils/render.js";
import PointsModel from "./models/points.js";
import FiltersModel from "./models/filter.js";
import DestinationsModel from "./models/offers.js";
import OffersModel from "./models/destinations.js";
import Statistics from "./view/statistics.js";
import {MenuItem, UpdateType} from "./consts.js";
import {remove} from "./utils/render.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic ib99ali`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);
const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
// const destinationsModel = new DestinationsModel();
// const offersModel = new OffersModel();

const filterModel = new FiltersModel();
const boardPresenter = new BoardView(allEvents, pointsModel, filterModel); // , api.getDestinations(), api.getOffers()

const locationCostWrapperComponent = new LocationCostWrapperView();

if (api.getPoints().length > 0) {
  const locationCost = new LocationCost(locationCostWrapperComponent, pointsModel);
  locationCost.init();
}

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

const menuComponent = new MenuView();
render(menuFilterFirstTitle, menuComponent, RenderPosition.AFTEREND);
const filterPresenter = new FilterView(menuFilterWrapper, filterModel, pointsModel);
const statsComponent = new Statistics(pointsModel);

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

api.getAllData()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripInfo, locationCostWrapperComponent, RenderPosition.AFTERBEGIN);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

// api.getDestinations().then((destinations) => {
//   destinationsModel.setDestinations(destinations);
// });

// api.getOffers().then((offers) => {
//   offersModel.setOffers(offers);
// });
