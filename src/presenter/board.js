import SortView from './../view/sort.js';
import TripDaysListView from './../view/tripDaysList.js';
import TripDayView from './../view/tripDay.js';
import TripPointsListView from './../view/tripPointsList.js';
import NoPointView from './../view/noPoint.js';
import Point from './point.js';
import {render, RenderPosition, remove} from './../utils/render.js';
import {getSetDates} from "./../utils/point.js";
import {SortType, UserAction, UpdateType} from "./../consts.js";
import {sortTime, sortPrice} from "./../utils/point.js";

export default class Board {
  constructor(boardContainer, pointsModel) {
    this._boardContainer = boardContainer;
    this._pointsModel = pointsModel;
    this._defaultSortType = SortType.DEFAULT;

    this._pointPresenters = {};
    this._daysPresenters = [];
    this._tripPointsLists = [];
    this._sortComponent = null;
    this._tripDaysListComponent = new TripDaysListView();
    this._noPointsComponent = new NoPointView();
    this._point = new Point();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePoinChange = this._handlePoinChange.bind(this);
    this._handleModelAction = this._handleModelAction.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._pointsModel.addObserver(this._handleModelAction);
  }

  init() {
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
    }

    if (this._getPoints().length > 0) {
      this._renderTripDaysList();

      this._defaultRendering();
    }
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortTime);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortPrice);
    }

    return this._pointsModel.getPoints();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPoints();

    if (this._currentSortType === SortType.DEFAULT) {
      this._defaultRendering();
    } else {
      this._tripDayComponent = new TripDayView();
      this._renderTripDay();
      this._daysPresenters.push(this._tripDayComponent);

      this._tripPointsListComponent = new TripPointsListView();
      this._renderTripPointsList();
      this._tripPointsLists.push(this._tripPointsListComponent);

      this._getPoints().forEach((element) => {
        this._renderPoint(element);
      });
    }

  }

  _defaultRendering() {
    console.log(this._getPoints());
    getSetDates(this._getPoints()).forEach((date, index) => {
      const normalDate = new Date(date);
      const filtredData = this._getPoints().slice().filter((dataItem) => {
        return dataItem.dateFrom.toDateString() === normalDate.toDateString();
      });

      this._tripDayComponent = new TripDayView(normalDate, index);
      this._renderTripDay();
      this._daysPresenters.push(this._tripDayComponent);

      this._tripPointsListComponent = new TripPointsListView();
      this._tripPointsLists.push(this._tripPointsListComponent);
      this._renderTripPointsList();

      filtredData.forEach((dataItem) => {
        this._renderPoint(dataItem);
      });
    });
  }

  _renderPoint(data) {
    const point = new Point(this._tripPointsListComponent, this._handleViewAction, this._handlePoinChange);
    point.init(data);
    this._pointPresenters[data.id] = point;
  }

  _handlePoinChange() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelAction(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._defaultRendering();
        break;
      case UpdateType.Major:
        this._clearBoard({resetSortType: true});
        this._defaultRendering();
        break;
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView();
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

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._pointPresenters = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    this._daysPresenters.forEach((dayPresenter) => {
      remove(dayPresenter);
    });
    this._tripPointsLists.forEach((tripPointList) => {
      remove(tripPointList);
    });

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearPoints() {
    this._daysPresenters.forEach((dayPresenter) => {
      remove(dayPresenter);
    });
    this._tripPointsLists.forEach((tripPointList) => {
      remove(tripPointList);
    });
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._pointPresenters = {};
  }
}
