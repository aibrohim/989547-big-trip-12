import TripPointView from "./../view/trip-point.js";
import EventEditorView from "./../view/event-editor.js";
import {replace, render, RenderPosition, remove} from "./../utils/render.js";
import TripPointsList from "../view/trip-points-list.js";
import {UserAction, UpdateType} from "../consts.js";
import {isDatesEqual} from "../utils/point.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(parentElement, changeData, changeMode) {
    this._changeData = changeData;
    this._parentElement = parentElement;
    this._changeMode = changeMode;

    this._tripPointComponent = null;
    this._eventEditorComponent = null;
    this._mode = Mode.DEFAULT;

    this._tripPointsList = new TripPointsList();
    this._replacePointToEdit = this._replacePointToEdit.bind(this);
    this._replaceEditToPoint = this._replaceEditToPoint.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._changeFavoriteHandler = this._changeFavoriteHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(data) {
    this._data = data;
    const prevPointComponent = this._tripPointComponent;
    const prevEditComponent = this._eventEditorComponent;

    this._tripPointComponent = new TripPointView(data, offers);
    this._eventEditorComponent = new EventEditorView(data, offers, destinations);

    this._tripPointComponent.setEditClickHandler(this._replacePointToEdit);
    this._eventEditorComponent.setPointOpenHandler(this._replaceEditToPoint);
    this._eventEditorComponent.setEscPressHandler(this._replaceEditToPoint);
    this._eventEditorComponent.setFavoriteClick(this._changeFavoriteHandler);
    this._eventEditorComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventEditorComponent.setDeleteHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this._parentElement, this._tripPointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripPointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditorComponent, prevEditComponent);
    }
  }

  _replacePointToEdit() {
    replace(this._eventEditorComponent, this._tripPointComponent);
    document.addEventListener(`keydown`, this._onEscPress);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPoint() {
    replace(this._tripPointComponent, this._eventEditorComponent);
    document.removeEventListener(`keydown`, this._onEscPress);
    this._mode = Mode.DEFAULT;
  }

  _onEscPress(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._eventEditorComponent.resetData(this._data);
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  changeTypeHandler(callback) {
    this._updateType = callback;
  }

  _changeFavoriteHandler() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._data,
            {
              "is_favorite": !this._data.is_favorite
            }
        )
    );
  }

  _handleFormSubmit(data) {
    const isMinorUpdate = isDatesEqual(this._data.dateFrom, data.dateFrom)
    || isDatesEqual(this._data.dateTo, data.dateTo)
    || this._data.cost === data.cost;

    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        data
    );
    this._replaceEditToPoint();
  }

  _handleDeleteClick(data) {
    this._changeData(
        UserAction.DELETE_POINT,
        this._updateType ? this._updateType : UpdateType.PATCH,
        data
    );
    remove(this._eventEditorComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._tripPointComponent);
    remove(this._eventEditorComponent);
  }
}
