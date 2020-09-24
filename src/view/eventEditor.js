import Smart from "./Smart.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEventAdder = (data) => {
  const {type, city, offers, about, dateFrom, dateTo, cost, isFavourite} = data;
  const {description, images} = about;

  return `<form class="event  event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>

          <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type.toLowerCase() === `taxi` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--taxi" data-type="Taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type.toLowerCase() === `bus` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--bus" data-type="Bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type.toLowerCase() === `train` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--train" data-type="Train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type.toLowerCase() === `ship` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--ship" data-type="Ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${type.toLowerCase() === `transport` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--transport" data-type="Transport" for="event-type-transport-1">Transport</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type.toLowerCase() === `drive` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--drive" data-type="Drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type.toLowerCase() === `flight` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--flight" data-type="Flight" for="event-type-flight-1">Flight</label>
          </div>
        </fieldset>

        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type.toLowerCase() === `check-in` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--check-in" data-type="Check-in"  for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type.toLowerCase() === `sightseeeing` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--sightseeing" data-type="Sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type.toLowerCase() === `restaurant` ? `checked` : ``}>
            <label class="event__type-label  event__type-label--restaurant" data-type="Restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type} ${type === `Sightseeing` || type === `Check-in` || type === `Restaurant` ? `in` : `to`}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom.getDate()}/${dateFrom.getMonth() + 1}/${dateFrom.getFullYear().toString().slice(2, 4)} ${dateFrom.getHours()}:${dateFrom.getMinutes()}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo.getDate()}/${dateTo.getMonth() + 1}/${dateTo.getFullYear().toString().slice(2, 4)} ${dateTo.getHours()}:${dateTo.getMinutes()}">
      </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>

    <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>

  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      <div class="event__available-offers">
      ${offers.map((offer, index) =>
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" type="checkbox" name="event-offer-luggage" ${offer.isChecked === true ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-luggage-${index}">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.cost}</span>
        </label>
      </div>`).join(``)}
      </div>
    </section>
    <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${images.map((image) =>
    `<img class="event__photo" src="${image}" alt="Event photo">`
  ).join(``)}
          </div>
        </div>
      </section>
  </section>
</form>`;
};

export default class EventEditor extends Smart {
  constructor(data) {
    super();
    this._data = data;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._pointOpenClikHandler = this._pointOpenClikHandler.bind(this);
    this._pointEscPress = this._pointEscPress.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._saveHandler = this._saveHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._setDateFromPicker = this._setDateFromPicker.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._setDateToPicker = this._setDateToPicker.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateToPicker();
    this._setDateFromPicker();
  }

  resetData(data) {
    this.updateData(data);
  }

  _favouriteClickHandler() {
    this._callback.favouriteClick();
  }

  _pointEscPress() {
    this._callback.escPress();
  }

  _pointOpenClikHandler(evt) {
    evt.preventDefault();
    this._callback.poinOpenClick();
  }

  getTemplate() {
    return createEventAdder(this._data);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this.updateData({type: evt.target.dataset.type});
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          'enableTime': true,
          'defaultDate': this._data.dateFrom,
          'dateFormat': `d/m/y H:i`,
          'maxDate': this._data.dateTo,
          'time_24hr': true,
          'onChange': this._startDateChangeHandler
        }
    );
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          'enableTime': true,
          'defaultDate': this._data.dateTo,
          'dateFormat': `d/m/y H:i`,
          'minDate': this._data.dateFrom,
          'time_24hr': true,
          'onChange': this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate
    }, true);
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate
    }, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._typeChangeHandler);
    this.getElement().querySelector(`#event-start-time-1`).addEventListener(`change`, this._setDateFromPicker);
    this.getElement().querySelector(`#event-end-time-1`).addEventListener(`change`, this._setDateToPicker);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setSubmitHandler(this._callback.saveHandler);
  }

  _saveHandler(evt) {
    evt.preventDefault();
    if ((this._data.dateFrom - this._data.dateTo) >= 0) {
      this.getElement().querySelector(`#event-start-time-1`).setCustomValidity(`heeey`);
      alert(`to'g'irlasen bomidimi`);
      return;
    }
    this._callback.saveHandler(this._data);
  }

  setFavouriteClick(callback) {
    this._callback.favouriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favouriteClickHandler);
  }

  setPointOpenHandler(callback) {
    this._callback.poinOpenClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._pointOpenClikHandler);
  }

  setEscPressHandler(callback) {
    this._pointEscPress = callback;
    this.getElement().addEventListener(`submit`, this._pointEscPress);
  }

  setSubmitHandler(callback) {
    this._callback.saveHandler = callback;
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._saveHandler);
  }
}
