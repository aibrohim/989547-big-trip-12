import AbstractView from "./Abstract.js";

const createTripPoint = (data) => {
  const {type, city, offers, date, cost} = data;
  const {start, finish} = date;
  const MILLISECONDS_IN_SECOND = 1000;
  const SECONDS_IN_DAY = 86400;
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_MINUTE = 60;

  const tripStartTime = () => {
    const hours = start.getHours();
    const minutes = start.getMinutes();

    return `${hours}:${minutes}`;
  };

  const tripFinishTime = () => {
    const hours = finish.getHours();
    const minutes = finish.getMinutes();

    return `${hours}:${minutes}`;
  };

  const tripDuration = () => {
    const startInSecond = start.getTime();
    const finishInSecon = finish.getTime();
    let durationSeconds = Math.floor((finishInSecon - startInSecond) / MILLISECONDS_IN_SECOND);

    const durationDays = () => {
      const days = Math.floor(durationSeconds / SECONDS_IN_DAY);
      durationSeconds -= (days * SECONDS_IN_DAY);

      if (days === 0) {
        return ``;
      }

      return `${days}D `;
    };

    const durationHours = () => {
      const hours = Math.floor(durationSeconds / SECONDS_IN_HOUR);
      durationSeconds -= (hours * SECONDS_IN_HOUR);

      if (hours === 0) {
        return ``;
      }

      return `${hours}H `;
    };

    const durationMinutes = () => {
      const minutes = Math.floor(durationSeconds / SECONDS_IN_MINUTE);
      durationSeconds -= (minutes * SECONDS_IN_MINUTE);

      if (minutes === 0) {
        return ``;
      }

      return `${minutes}M `;
    };

    return `${durationDays()}${durationHours()}${durationMinutes()}`;
  };

  const filtredOffers = offers.slice().filter((offer) => offer.isChecked);

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${type === `Sightseeing` || type === `Check-in` || type === `Restaurant` ? `in` : `to`} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${start.toISOString()}">${tripStartTime()}</time>
          &mdash;
          <time class="event__end-time" datetime="${finish.toISOString()}">${tripFinishTime()}</time>
        </p>
        <p class="event__duration">${tripDuration()}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${cost}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      ${offers.length === 0 ? `` : `<ul class="event__selected-offers">
      ${filtredOffers.slice(0, 3).map((offer) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.cost}</span>
       </li>`;
  }).join(``)}
    </ul>`}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripPoint extends AbstractView {
  constructor(data) {
    super();

    this._info = data;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTripPoint(this._info);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
