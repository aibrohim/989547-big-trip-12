import EventAdderView from "../view/event-editor.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../consts.js";

export default class Point {
  constructor(parentElement, changeData) {
    this._changeData = changeData;
    this._parentElement = parentElement;

    this._eventAdderComponent = null;

    this._onEscPress = this._onEscPress.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(destinations, offers) {
    this._offers = offers;
    this._destinations = destinations;

    this._eventAdderComponent = new EventAdderView(null, offers, destinations);
    render(this._parentElement, this._eventAdderComponent, RenderPosition.AFTEREND);

    this._eventAdderComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventAdderComponent.setDeleteHandler(this._handleDeleteClick);

    document.addEventListener(`keydown`, this._onEscPress);
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
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
        data
    );
  }

  _handleDeleteClick() {
    remove(this._eventAdderComponent);
    this.destroy();
  }

  setAborting() {
    const resetFormState = () => {
      this._eventAdderComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventAdderComponent.shake(resetFormState);
  }

  setSaving() {
    this._eventAdderComponent.updateData({isSaving: true, isDisabled: true});
  }

  destroy() {
    if (this._eventAdderComponent === null) {
      return;
    }
    remove(this._eventAdderComponent);
    this._eventAdderComponent = null;
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
