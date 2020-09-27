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
import {filter} from "./../utils/filter.js";

export default class Board {
  constructor(boardContainer, pointsModel, filterModel) {
    this._boardContainer = boardContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._defaultSortType = SortType.DEFAULT;

    this._pointPresenters = {};
    this._daysPresenters = [];
    this._tripPointsLists = [];
    this._sortComponent = null;
    this._tripDays = [];

    this._currentSortType = SortType.DEFAULT;
    this._tripDaysListComponent = new TripDaysListView();
    this._noPointsComponent = new NoPointView();
    this._point = new Point();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSort();
    this._defaultRendering();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort(sortTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortPrice);
    }

    return filtredPoints;
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
      this._sortRendering();
    }
  }

  _sortRendering() {
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

  _defaultRendering() {
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
    }

    if (this._getPoints().length > 0) {
      this._renderTripDaysList();
    }

    getSetDates(this._getPoints()).forEach((date, index) => {
      const normalDate = new Date(date);
      const filtredData = this._getPoints().slice().filter((dataItem) => {
        return dataItem.dateFrom.toDateString() === normalDate.toDateString();
      });

      this._tripDays.push(filtredData);

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
    const point = new Point(this._tripPointsListComponent, this._handleViewAction, this._handlePointChange);
    this._point = point;
    point.init(data);
    this._pointPresenters[data.id] = point;
  }

  _handlePointChange() {
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
        const arrayWithUpdate = this._tripDays.findIndex((array) => array.includes(update));
        const deletedPointIndex = this._tripDays[arrayWithUpdate].findIndex((point) => point.id === update.id);

        this._tripDays[arrayWithUpdate] = [
          ...this._tripDays[arrayWithUpdate].slice(0, deletedPointIndex),
          ...this._tripDays[arrayWithUpdate].slice(deletedPointIndex + 1),
        ];
        const findNullArray = this._tripDays.findIndex((array) => array.length === 0);


        this._pointsModel.deletePoint(updateType, update);

        if (this._tripDays[findNullArray] >= 0) {
          this._clearBoard();
          this._renderSort();
          if (this._currentSortType === SortType.DEFAULT) {
            this._defaultRendering();
          } else {
            this._sortRendering();
          }
        }

        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data);

        if (this._getPoints().length === 0) {
          remove(this._tripDaysListComponent);
        }

        break;
      case UpdateType.MINOR:
        this._clearPoints();
        if (this._currentSortType === SortType.DEFAULT) {
          this._defaultRendering();
        } else {
          this._sortRendering();
        }
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderSort();
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
