import LocationCostWrapperView from './view/locationCostWrapper.js';
import LocationInfoView from './view/locationInfo.js';
import CostInfoView from './view/costInfo.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import BoardView from './presenter/board.js';
import SortView from './view/sort.js';
import EventEditorView from './view/eventEditor.js';
import TripDaysListView from './view/tripDaysList.js';
import TripDayView from './view/tripDay.js';
import TripPointsListView from './view/tripPointsList.js';
import TripPointView from './view/tripPoint.js';
import NoPointView from './view/noPoint.js';
import {generateTripPoint} from './mock/tripPoint.js';
import {getSetDates} from "./utils/point.js";
import {render, RenderPosition} from "./utils/render.js";

const MAX_TRIPS = 15;

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


// SHO'TDAN BOSHLAB KOCHIRISH KERE

const pageMain = document.querySelector(`.page-body__page-main`);
const allEvents = pageMain.querySelector(`.trip-events`);

const boardComponent = new BoardView(allEvents);

boardComponent.init(tripPointsData);

// if (tripPointsData.length === 0) {
//   const noPoints = new NoPointView();
//   render(allEvents, noPoints, RenderPosition.BEFOREEND);
// } else {
//   const sortComponent = new SortView();
//   render(allEvents, sortComponent, RenderPosition.AFTERBEGIN);
// }

// if (tripPointsData.length > 0) {
//   const tripDaysListComponent = new TripDaysListView();
//   render(allEvents, tripDaysListComponent, RenderPosition.BEFOREEND);

//   getSetDates(tripPointsData).forEach((date, index) => {
//     const normalDate = new Date(date);
//     const filtredData = tripPointsData.filter((dataItem) => {
//       return dataItem.date.start.toDateString() === normalDate.toDateString();
//     });

//     const tripDayComponent = new TripDayView(normalDate, filtredData, index);
//     render(tripDaysListComponent, tripDayComponent, RenderPosition.BEFOREEND);

//     const tripPointsListComponent = new TripPointsListView();
//     render(tripDayComponent, tripPointsListComponent, RenderPosition.BEFOREEND);

//     filtredData.forEach((dataItem) => {
//       renderPoint(tripPointsListComponent, dataItem);
//     });
//   });
// }

