import EventAdderView from "./../view/eventEditor.js";
import {replace, render, RenderPosition, remove} from "./../utils/render.js";
import {UserAction, UpdateType} from "../consts.js";
import {isDatesEqual} from "../utils/point.js";
import offers from "./../mock/offers.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(parentElement, changeData) {
    this._changeData = changeData;
    this._parentElement = parentElement;

    this._eventAdderComponent = null;

    this._onEscPress = this._onEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(destinations) {
    this._offers = offers;
    this._destinations = destinations;
    const prevEditComponent = this._eventAdderComponent;

    this._eventAdderComponent = new EventAdderView(null, offers, destinations);
    render(this._parentElement, this._eventAdderComponent, RenderPosition.AFTEREND);

    this._eventAdderComponent.setEscPressHandler(this._replaceEditToPoint);
    this._eventAdderComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventAdderComponent.setDeleteHandler(this._handleDeleteClick);

    if (this._mode === Mode.EDITING) {
      replace(this._eventAdderComponent, prevEditComponent);
    }
  }

  _onEscPress(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._eventAdderComponent.resetData(this._data);
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  _handleFormSubmit(data) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        data
    );
    this._replaceEditToPoint();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  destroy() {
    if (this._eventAdderComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventAdderComponent);
    this._eventAdderComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
