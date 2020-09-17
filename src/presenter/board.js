import SortView from './../view/sort.js';
import TripDaysListView from './../view/tripDaysList.js';
import TripDayView from './../view/tripDay.js';
import TripPointsListView from './../view/tripPointsList.js';
import NoPointView from './../view/noPoint.js';
import Point from './point.js';
import {render, RenderPosition, remove} from './../utils/render.js';
import {getSetDates} from "./../utils/point.js";
import {SortType} from "./../consts.js";
import {updateItem} from "./../utils/common.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._defaultSortType = SortType.DEFAULT;

    this._pointPresenters = {};
    this._daysPresenters = [];
    this._sortComponent = new SortView();
    this._tripDaysListComponent = new TripDaysListView();
    this._noPointsComponent = new NoPointView();
    this._point = new Point();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(data) {
    this._pointsData = data.slice();
    this._sourcedData = data.slice();


    if (this._pointsData.length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
    }

    if (this._pointsData.length > 0) {
      this._renderTripDaysList();

      this._defaultRendering(this._pointsData);
    }
  }

  _handlePointChange(updatePoint) {
    this._pointsData = updateItem(this._pointsData, updatePoint);
    this._sourcedData = updateItem(this._sourcedData, updatePoint);
    console.log(updatePoint);
    this._pointPresenters[updatePoint.id].init(updatePoint);
  }

  _sortPoints(sortType) {
    const sortTime = (a, b) => {
      const firstDate = a.date.finish - a.date.start;
      const secondDate = b.date.finish - b.date.start;
      return secondDate - firstDate;
    };

    const sortPrice = (a, b) => b.cost - a.cost;

    switch (sortType) {
      case SortType.TIME:
        this._pointsData.sort(sortTime);
        break;
      case SortType.PRICE:
        this._pointsData.sort(sortPrice);
        break;
      default:
        this._pointsData = this._sourcedData.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPoints();

    if (sortType === SortType.DEFAULT) {
      this._defaultRendering(this._pointsData);
    } else {
      this._tripDayComponent = new TripDayView();
      this._renderTripDay();
      this._daysPresenters.push(this._tripDayComponent);

      this._tripPointsListComponent = new TripPointsListView();
      this._renderTripPointsList();

      this._pointsData.forEach((element) => {
        this._renderPoint(element);
      });
    }

  }

  _defaultRendering(data) {
    getSetDates(data).forEach((date, index) => {
      const normalDate = new Date(date);
      const filtredData = data.filter((dataItem) => {
        return dataItem.date.start.toDateString() === normalDate.toDateString();
      });

      this._tripDayComponent = new TripDayView(normalDate, index);
      this._renderTripDay();
      this._daysPresenters.push(this._tripDayComponent);

      this._tripPointsListComponent = new TripPointsListView();
      this._renderTripPointsList();

      filtredData.forEach((dataItem) => {
        this._renderPoint(dataItem);
      });
    });
  }

  _renderPoint(data) {
    const point = new Point(this._tripPointsListComponent, this._handlePointChange);
    point.init(data);
    this._pointPresenters[data.id] = point;
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTripDaysList() {
    render(this._boardContainer, this._tripDaysListComponent, RenderPosition.BEFOREEND);
  }

  _renderTripDay() {
    render(this._tripDaysListComponent, this._tripDayComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPointsList() {
    render(this._tripDayComponent, this._tripPointsListComponent, RenderPosition.BEFOREEND);
  }

  _clearPoints() {
    this._daysPresenters.forEach((dayPresenter) => {
      remove(dayPresenter);
    });
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._pointPresenters = {};
  }
}
