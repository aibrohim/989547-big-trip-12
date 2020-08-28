import {createElement} from "../utils.js";

const createTripDaysList = () => {
  return `<ul class="trip-days">
      </ul>
    `;
};

export default class TripDaysList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
