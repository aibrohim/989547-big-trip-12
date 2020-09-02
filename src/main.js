import LocationCostWrapperView from './view/locationCostWrapper.js';
import LocationInfoView from './view/locationInfo.js';
import CostInfoView from './view/costInfo.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import EventEditorView from './view/eventEditor.js';
import TripDaysListView from './view/tripDaysList.js';
import TripDayView from './view/tripDay.js';
import TripPointsListView from './view/tripPointsList.js';
import TripPointView from './view/tripPoint.js';
import NoPointView from './view/noPoint.js';
import {generateTripPoint} from './mock/tripPoint.js';
import {getSetDates} from "./utils.js";
import {render, RenderPosition} from "./utils.js";

const MAX_TRIPS = 0;

const renderPoint = (tripPointsListElement, tripPointInfo) => {
  const pointComponent = new TripPointView(tripPointInfo);
  const pointEditComponent = new EventEditorView(tripPointInfo);

  const replacePointToEdit = () => {
    tripPointsListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceEditToPoint = () => {
    tripPointsListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscPress);
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscPress);
  });

  pointEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscPress);
  });

  pointEditComponent.getElement().addEventListener(`submit`, () => {
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscPress);
  });

  render(tripPointsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripPointsData = new Array(MAX_TRIPS)
  .fill()
  .map(generateTripPoint)
  .sort((a, b) => a.date.start - b.date.start);

const siteHeader = document.querySelector(`.page-header`);
const tripInfo = siteHeader.querySelector(`.trip-main`);

const locationCostWrapperComponent = new LocationCostWrapperView();
render(tripInfo, locationCostWrapperComponent.getElement(), RenderPosition.AFTERBEGIN);

if (tripPointsData.length > 0) {
  render(locationCostWrapperComponent.getElement(), new LocationInfoView(tripPointsData).getElement(), RenderPosition.AFTERBEGIN);
  render(locationCostWrapperComponent.getElement(), new CostInfoView(tripPointsData).getElement(), RenderPosition.BEFOREEND);
}

const menuFilterWrapper = tripInfo.querySelector(`.trip-main__trip-controls`);
const menuFilterFirstTitle = menuFilterWrapper.querySelector(`h2`);

const menuComponent = new MenuView();
render(menuFilterFirstTitle, menuComponent.getElement(), RenderPosition.AFTEREND);
const filterComponent = new FilterView();
render(menuFilterWrapper, filterComponent.getElement(), RenderPosition.BEFOREEND);

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

if (tripPointsData.length === 0) {
  const noPoints = new NoPointView();
  render(allEvents, noPoints.getElement(), RenderPosition.BEFOREEND);
} else {
  const sortComponent = new SortView();
  render(allEvents, sortComponent.getElement(), RenderPosition.AFTERBEGIN);
}

if (tripPointsData.length > 0) {
  const tripDaysListComponent = new TripDaysListView();
  render(allEvents, tripDaysListComponent.getElement(), RenderPosition.BEFOREEND);

  getSetDates(tripPointsData).forEach((date, index) => {
    const normalDate = new Date(date);
    const filtredData = tripPointsData.filter((dataItem) => {
      return dataItem.date.start.toDateString() === normalDate.toDateString();
    });

    const tripDayComponent = new TripDayView(normalDate, filtredData, index);
    render(tripDaysListComponent.getElement(), tripDayComponent.getElement(), RenderPosition.BEFOREEND);

    const tripPointsListComponent = new TripPointsListView();
    render(tripDayComponent.getElement(), tripPointsListComponent.getElement(), RenderPosition.BEFOREEND);

    filtredData.forEach((dataItem) => {
      renderPoint(tripPointsListComponent.getElement(), dataItem);
    });
  });
}

