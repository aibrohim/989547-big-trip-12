import EventAdderView from "./../view/eventEditor.js";
import {replace, render, RenderPosition, remove} from "./../utils/render.js";
import {UserAction, UpdateType} from "../consts.js";
import {isDatesEqual} from "../utils/point.js";
import offers from "./../mock/offers.js";
import {generateId} from "./../mock/tripPoint.js";

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

    this._eventAdderComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventAdderComponent.setDeleteHandler(this._handleDeleteClick);

    document.addEventListener(`keydown`, this._onEscPress);
    if (this._eventAdderComponent) {
      document.querySelector(`.trip-main__event-add-btn`).disabled = true;
    } else {
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    }
  }

  _onEscPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.destroy();
      document.removeEventListener(`keydown`, this._onEscPress);
    }
  }

  _handleFormSubmit(data) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        Object.assign({id: generateId()}, data)
    );
    console.log(data);
    this.destroy();
  }

  _handleDeleteClick() {
    remove(this._eventAdderComponent);
    this.destroy();
  }

  destroy() {
    if (this._eventAdderComponent === null) {
      return;
    }
    remove(this._eventAdderComponent);
    this._eventAdderComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
