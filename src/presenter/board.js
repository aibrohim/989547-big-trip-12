import SortView from "./../view/sort.js";
import TripDaysListView from "./../view/trip-days-list.js";
import TripDayView from "./../view/trip-day.js";
import TripPointsListView from "./../view/trip-points-list.js";
import NoPointView from "./../view/no-point.js";
import Point, {State as PointPresenterViewState} from "./point.js";
import PointAdder from "./new-point.js";
import {render, RenderPosition, remove} from "./../utils/render.js";
import {getSetDates} from "./../utils/point.js";
import {SortType, UserAction, UpdateType, FilterType} from "./../consts.js";
import {sortTime, sortPrice} from "./../utils/point.js";
import {filter} from "./../utils/filter.js";
import LoadingView from "./../view/loading.js";

export default class Board {
  constructor(boardContainer, pointsModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._defaultSortType = SortType.DEFAULT;
    this._api = api;

    this._pointPresenters = {};
    this._daysPresenters = [];
    this._tripPointsLists = [];
    this._sortComponent = null;
    this._tripDays = [];
    this._isLoading = true;

    this._currentSortType = SortType.DEFAULT;
    this._tripDaysListComponent = new TripDaysListView();
    this._noPointsComponent = new NoPointView();
    this._point = new Point();
    this._loadingComponent = new LoadingView();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._pointData = this._getPoints();

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    if (this._sortComponent === null) {
      this._renderSort();
    }

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._defaultRendering();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointAdderPresenter = new PointAdder(this._sortComponent, this._handleViewAction);
    this._pointAdderPresenter.init(this._destinations, this._offers);
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
    return filtredPoints.sort((a, b) => a.dateFrom - b.dateTo);
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

  _defaultRendering(trips = this._getPoints().slice()) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (trips.length > 0) {
      this._renderTripDaysList();
    }

    const sortedData = trips.sort((a, b) => a.dateFrom - b.dateFrom);

    getSetDates(sortedData).forEach((date, index) => {
      const normalDate = new Date(date);
      const filtredData = sortedData.slice().filter((dataItem) => {
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
    if (this._pointAdderPresenter) {
      this._pointAdderPresenter.destroy();
    }
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenters[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._taskPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointAdderPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointAdderPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenters[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          }).catch(() => {
            this._taskPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
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
        this._clearBoard();
        if (this._getPoints().length > 0) {
          this._renderSort();
        }
        if (this._currentSortType === SortType.DEFAULT) {
          this._defaultRendering();
        } else {
          this._sortRendering();
        }
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        if (this._getPoints().length > 0) {
          this._renderSort();
        }
        this._defaultRendering();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetSortType = false} = {}) {
    if (this._pointAdderPresenter) {
      this._pointAdderPresenter.destroy();
    }
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

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._tripDaysListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }
}
