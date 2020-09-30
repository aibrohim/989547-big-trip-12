import LocationCostWrapperView from "./view/location-cost-wrapper.js";
import MenuView from "./view/menu.js";
import BoardPresenter from "./presenter/board.js";
import FilterView from "./presenter/filter.js";
import LocationCost from "./presenter/location-cost.js";
import {render, RenderPosition} from "./utils/render.js";
import PointsModel from "./models/points.js";
import FiltersModel from "./models/filter.js";
import StoreModel from "./models/store.js";
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

const filterModel = new FiltersModel();
const board = new BoardPresenter(allEvents, pointsModel, filterModel, api);

const locationCostWrapperComponent = new LocationCostWrapperView();

render(tripInfo, locationCostWrapperComponent, RenderPosition.AFTERBEGIN);

const locationCost = new LocationCost(locationCostWrapperComponent, pointsModel);

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

const menuComponent = new MenuView();
render(menuFilterFirstTitle, menuComponent, RenderPosition.AFTEREND);
const filterPresenter = new FilterView(menuFilterWrapper, filterModel, pointsModel);

let statsComponent = null;

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      if (statsComponent) {
        remove(statsComponent);
      }
      board.init();
      break;
    case MenuItem.STATISTICS:
      board.destroy();
      statsComponent = new Statistics(pointsModel.getPoints());
      render(allEvents, statsComponent, RenderPosition.AFTEREND);
      break;
  }
};

menuComponent.setMenuClickHandler(menuClickHandler);

filterPresenter.init();
board.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  board.createPoint();
});

api.getAllData()
  .then((responses) => {
    const OFFERS = responses[0];
    const DESTINATIONS = responses[1];
    const POINTS = responses[2];
    StoreModel.setOffers(OFFERS);
    StoreModel.setDestinations(DESTINATIONS);
    pointsModel.setPoints(UpdateType.INIT, POINTS);
    locationCost.init();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

