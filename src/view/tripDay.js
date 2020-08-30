import {createElement} from "./../utils.js";

const createTripDay = (date, data, index) => {
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${date.toDateString().slice(3, 7)} ${date.getDate()}</time>
      </div>
    </li>`;
};

export default class TripDay {
  constructor(date, data, index) {
    this._element = null;
    this._date = date;
    this._info = data;
    this._index = index;
  }

  getTemplate() {
    return createTripDay(this._date, this._info, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
