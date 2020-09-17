import TripPointView from "./../view/tripPoint.js";
import EventEditorView from "./../view/eventEditor.js";
import {replace, render, RenderPosition, remove} from "./../utils/render.js";
import TripPointsList from "../view/tripPointsList.js";

export default class Point {
  constructor(changeData) {
    this._tripPointComponent = null;
    this._eventEditorComponent = null;
    this._changeData = changeData;

    this._tripPointsList = new TripPointsList();
    this._replacePointToEdit = this._replacePointToEdit.bind(this);
    this._replaceEditToPoint = this._replaceEditToPoint.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
    this._changeFavouriteHandler = this._changeFavouriteHandler.bind(this);
  }

  init(data, parentElement) {
    this._data = data;
    const prevPointComponent = this._tripPointComponent;
    const prevEditComponent = this._eventEditorComponent;

    this._tripPointComponent = new TripPointView(data);
    this._eventEditorComponent = new EventEditorView(data);

    this._tripPointComponent.setEditClickHandler(this._replacePointToEdit);
    this._eventEditorComponent.setPointOpenHandler(this._replaceEditToPoint);
    this._eventEditorComponent.setEscPressHandler(this._replaceEditToPoint);
    this._eventEditorComponent.setFavouriteClick(this._changeFavouriteHandler);


    if (prevPointComponent === null || prevEditComponent === null) {
      render(parentElement, this._tripPointComponent, RenderPosition.BEFOREEND);
      return;
    }
    console.log(parentElement);

    console.log(prevPointComponent);


    if (parentElement.getElement().contains(prevPointComponent.getElement())) {
      replace(this._tripPointComponent, prevPointComponent);
    }

    if (parentElement.getElement().contains(prevEditComponent.getElement())) {
      replace(this._eventEditorComponent, prevEditComponent);
    }
  }

  _replacePointToEdit() {
    replace(this._eventEditorComponent, this._tripPointComponent);
    document.addEventListener(`keydown`, this._onEscPress);
  }

  _replaceEditToPoint() {
    replace(this._tripPointComponent, this._eventEditorComponent);
    document.removeEventListener(`keydown`, this._onEscPress);
  }

  _onEscPress(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
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

  destroy() {
    remove(this._tripPointComponent);
    remove(this._eventEditorComponent);
  }
}
