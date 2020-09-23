import TripPointView from "./../view/tripPoint.js";
import EventEditorView from "./../view/eventEditor.js";
import {replace, render, RenderPosition, remove} from "./../utils/render.js";
import TripPointsList from "../view/tripPointsList.js";

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
    this._changeFavouriteHandler = this._changeFavouriteHandler.bind(this);
  }

  init(data) {
    this._data = data;
    const prevPointComponent = this._tripPointComponent;
    const prevEditComponent = this._eventEditorComponent;

    this._tripPointComponent = new TripPointView(data);
    this._eventEditorComponent = new EventEditorView(data);

    this._tripPointComponent.setEditClickHandler(this._replacePointToEdit);
    this._eventEditorComponent.setPointOpenHandler(this._replaceEditToPoint);
    this._eventEditorComponent.setEscPressHandler(this._replaceEditToPoint);
    this._eventEditorComponent.setFavouriteClick(this._changeFavouriteHandler);
    this._eventEditorComponent.setSubmitHandler(this._handleFormSubmit);

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

  _changeFavouriteHandler() {
    this._changeData(
        Object.assign(
            {},
            this._data,
            {
              isFavourite: !this._data.isFavourite
            }
        )
    );
  }

  _handleFormSubmit(data) {
    this._changeData(data);
    this._replaceEditToPoint();
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