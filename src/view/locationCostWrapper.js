import {createElement} from "./../utils.js";

const createLocationCostWrapper = () => {
  return `<section class="trip-main__trip-info  trip-info">
          </section>`;
};

export default class LocationCostWrapper {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLocationCostWrapper();
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
