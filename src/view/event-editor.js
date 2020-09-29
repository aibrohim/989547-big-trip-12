import Smart from "./smart.js";
import flatpickr from "flatpickr";
import he from "he";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  "type": `Taxi`,
  "city": ``,
  "price": 0,
  "offers": [],
  "destination": {},
  "dateFrom": new Date(),
  "dateTo": new Date(),
  "is_favorite": true,
};

const createFavoriteInputTemplate = (event) => {
  if (!event.id) {
    return ``;
  }

  return (
    `<input id="event-${event.id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${event.is_favorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-${event.id}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRollupButtonTemplate = (event) => {
  if (!event.id) {
    return ``;
  }

  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );

};

export const getOffers = (offers, type) => {
  return offers.find((it) => it.type === type.toLowerCase()).offers;
};

const createDestinationTemplate = (event) => {
  if (event.destination === null || !event.destination.description || !event.destination.pictures) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${event.destination.description}
      </p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${event.destination.pictures.map((photoURL) =>
      (`<img class="event__photo" src="${photoURL.src}" alt="${photoURL.description}">`))
      .join(``)}
      </div>
    </div>`
  );
};

const createListOffersTemplate = (offers, isChecked) => {
  if (offers === null || offers.length === 0) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers
        .map((offer) => createNewOfferTemplate(
            offer,
            isChecked.some((it) => it.title === offer.title)
        )).join(``)}
    </div>`
  );
};

const createNewOfferTemplate = (offer, isChecked) => {
  const offerNameId = offer.title.split(` `).join(`-`).toLowerCase();


  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerNameId}" type="checkbox" name="event-offer-${offerNameId}" ${isChecked ? `checked` : ``} value="${offer.title}">
      <label class="event__offer-label" for="event-offer-${offerNameId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createEventAdder = (data, offers, destinations) => {
  const {type, city, dateFrom, dateTo, "base_price": basePrice, id} = data;
  const createOffersList = createListOffersTemplate(getOffers(offers, type), data.offers);

  const destinationTemplate = createDestinationTemplate(data);
  const favouriteIconTemplate = createFavoriteInputTemplate(data);
  const rollUpButtonTemplate = createRollupButtonTemplate(data);


  return `<form class="event  event--edit ${id ? `` : `trip-events__item`}" action="#" method="post">
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
        ${Object.keys(destinations).map((key) => `<option value="${key}"></option>`)}
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
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">${id ? `Delete` : `Cancel`}</button>

    ${favouriteIconTemplate}

    ${rollUpButtonTemplate}
  </header>

  <section class="event__details">
    <section class="event__section  event__section--offers">
    ${createOffersList}
    </section>
    <section class="event__section  event__section--destination">
        ${destinationTemplate}
      </section>
  </section>
</form>`;
};

export default class EventEditor extends Smart {
  constructor(data, offers, destinations) {
    super();
    this._data = data || BLANK_POINT;
    this._offers = offers;
    this._destinations = destinations;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._pointOpenClikHandler = this._pointOpenClikHandler.bind(this);
    this._pointEscPress = this._pointEscPress.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._saveHandler = this._saveHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._setDateFromPicker = this._setDateFromPicker.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._setDateToPicker = this._setDateToPicker.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._pointEscPress = this._pointEscPress.bind(this);

    this._setInnerHandlers();
    this._setDateToPicker();
    this._setDateFromPicker();
  }

  resetData(data) {
    this.updateData(data);
  }

  _favoriteClickHandler() {
    this._callback.favouriteClick();
  }

  _pointEscPress() {
    this._callback.escPress();
  }

  _pointOpenClikHandler(evt) {
    evt.preventDefault();
    this._callback.pointOpenClick();
  }

  getTemplate() {
    return createEventAdder(this._data, this._offers, this._destinations);
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
          enableTime: true,
          defaultDate: this._data.dateFrom,
          dateFormat: `d/m/y H:i`,
          onChange: this._startDateChangeHandler
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
          enableTime: true,
          defaultDate: this._data.dateTo,
          dateFormat: `d/m/y H:i`,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData(
        {
          dateTo: userDate
        });
  }

  _priceChangeHandler() {
    const saveButton = this.getElement().querySelector(`.event__save-btn`);
    const priceInput = this.getElement().querySelector(`#event-price-1`);
    const priceInputValue = parseInt(priceInput.value, 10);
    if (priceInputValue <= 0) {
      saveButton.disabled = true;
    } else {
      saveButton.disabled = false;
    }
    this.updateData({"base_price": priceInputValue}, true);
  }

  _cityChangeHandler() {
    const cityInputValue = this.getElement().querySelector(`#event-destination-1`).value;
    this.updateData({
      city: he.encode(cityInputValue),
      destination: this._destinations[cityInputValue]
    });
  }

  _offerClickHandler() {
    const checkedTitles = Array
      .from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .filter((element) => element.checked)
      .map((element) => element.value);
    const offers = getOffers(this._offers, this._data.type)
                    .filter((offer) => checkedTitles.includes(offer.title));

    this.updateData({
      offers,
    }, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._typeChangeHandler);
    this.getElement().querySelector(`#event-start-time-1`).addEventListener(`change`, this._setDateFromPicker);
    this.getElement().querySelector(`#event-end-time-1`).addEventListener(`change`, this._setDateToPicker);
    this.getElement().querySelector(`#event-price-1`).addEventListener(`change`, this._priceChangeHandler);
    this.getElement().querySelector(`#event-destination-1`).addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteHandler);
    this.getElement().querySelector(`.event__section--offers`).addEventListener(`change`, this._offerClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setSubmitHandler(this._callback.saveHandler);
  }

  setFavoriteClick(callback) {
    this._callback.favouriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setPointOpenHandler(callback) {
    this._callback.pointOpenClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._pointOpenClikHandler);
  }

  _pointEscPress(evt) {
    this._callback.pointEscPress(evt);
  }

  setEscPressHandler(callback) {
    this._callback.pointEscPress = callback;
    this.getElement().addEventListener(`submit`, this._pointEscPress);
  }

  static parsePointToData(point, offers) {
    return Object.assign(
        {},
        point,
        {
          "offers": getOffers(offers, point.type)
        }
    );
  }

  _saveHandler(evt) {
    evt.preventDefault();
    this._offerClickHandler();
    this._callback.saveHandler(this._data);
  }

  setSubmitHandler(callback) {
    this._callback.saveHandler = callback;
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._saveHandler);
  }

  _deleteHandler(evt) {
    evt.preventDefault();
    this._callback.deleteHandler(this._data);
  }

  setDeleteHandler(callback) {
    this._callback.deleteHandler = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteHandler);
  }
}
