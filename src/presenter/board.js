import SortView from './../view/sort.js';
import EventEditorView from './../view/eventEditor.js';
import TripDaysListView from './../view/tripDaysList.js';
import TripDayView from './../view/tripDay.js';
import TripPointsListView from './../view/tripPointsList.js';
import TripPointView from './../view/tripPoint.js';
import NoPointView from './../view/noPoint.js';
import {render, RenderPosition, replace} from './../utils/render.js';
import {getSetDates} from "./../utils/point.js";
import {SortType} from "./../consts.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._defaultSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._tripDaysListComponent = new TripDaysListView();
    this._noPointsComponent = new NoPointView();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(data) {
    this._pointsData = data;
    this._defaultData = data.slice();

    if (this._pointsData.length === 0) {
      this._renderNoPoints();
    } else {
      this._renderSort();
    }

    if (this._pointsData.length > 0) {
      this._renderTripDaysList();

      getSetDates(this._pointsData).forEach((date, index) => {
        const normalDate = new Date(date);
        const filtredData = this._pointsData.filter((dataItem) => {
          return dataItem.date.start.toDateString() === normalDate.toDateString();
        });

        this._tripDayComponent = new TripDayView(normalDate, filtredData, index);
        this._renderTripDay(filtredData);

        this._tripPointsListComponent = new TripPointsListView();
        this._renderTripPointsList();

        filtredData.forEach((dataItem) => {
          this._renderPoint(dataItem);
        });
      });
    }
  }

  _sortTasks(sortType) {
    const sortTime = (a, b) => {
      const firstDate = a.date.finish - a.date.start;
      const secondDate = b.date.finish - b.date.start;
      return secondDate - firstDate;
    };

    const sortPrice = (a, b) => b.cost - a.cost;

    switch (sortType) {
      case SortType.TIME:
        this._defaultData.sort(sortTime);
        break;
      case SortType.PRICE:
        this._defaultData.sort(sortPrice);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearPoints();
    this._renderTripDaysList();
    getSetDates(this._defaultData).forEach((date, index) => {
      const normalDate = new Date(date);
      const filtredData = this._defaultData.filter((dataItem) => {
        return dataItem.date.start.toDateString() === normalDate.toDateString();
      });

      this._tripDayComponent = new TripDayView(normalDate, filtredData, index);
      this._renderTripDay(filtredData);

      this._tripPointsListComponent = new TripPointsListView();
      this._renderTripPointsList();

      filtredData.forEach((dataItem) => {
        this._renderPoint(dataItem);
      });
    });
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
    this._tripDaysListComponent.getElement().innerHTML = ``;
  }

  _renderPoint(tripPointInfo) {
    const tripPointComponent = new TripPointView(tripPointInfo);
    const eventEditor = new EventEditorView(tripPointInfo);

    const replacePointToEdit = () => {
      replace(eventEditor, tripPointComponent);
    };

    const replaceEditToPoint = () => {
      replace(tripPointComponent, eventEditor);
    };

    const onEscPress = (evt) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener(`keydown`, onEscPress);
      }
    };

    tripPointComponent.setEditClickHandler(() => {
      replacePointToEdit();
      document.addEventListener(`keydown`, onEscPress);
    });

    eventEditor.setPointOpenHandler(() => {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscPress);
    });

    eventEditor.setEscPressHandler(() => {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscPress);
    });

    render(this._tripPointsListComponent, tripPointComponent, RenderPosition.BEFOREEND);
  }
}
