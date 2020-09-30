import AbstractView from "./abstract.js";

const createTripDay = (date, index) => {
  return `<li class="trip-days__item  day">
      <div class="day__info">
      ${(date === undefined && index === undefined) ? `` : `<span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="2019-03-18">${date.toDateString().slice(3, 7)} ${date.getDate()}</time>`}
      </div>
    </li>`;
};

export default class TripDay extends AbstractView {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createTripDay(this._date, this._index);
  }
}
