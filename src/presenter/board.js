import SortView from './../view/sort.js';
import EventEditorView from './../view/eventEditor.js';
import TripDaysListView from './../view/tripDaysList.js';
import TripDayView from './../view/tripDay.js';
import TripPointsListView from './../view/tripPointsList.js';
import TripPointView from './../view/tripPoint.js';
import NoPointView from './../view/noPoint.js';
import {render, RenderPosition, replace} from './../utils/render.js';
import {getSetDates} from "./../utils/point.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._sortComponent = new SortView();
    this._tripDaysListComponent = new TripDaysListView();
    this._noPointsComponent = new NoPointView();
  }

  init(data) {
    this._pointsData = data;

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

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
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
