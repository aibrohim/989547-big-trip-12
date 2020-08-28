import {createElement} from "../utils.js";

const createCostInfo = (data) => {
  const totalPrice = data.reduce((total, currentData) => {
    return total + currentData.cost;
  }, 0);
  window.data = data;

  return `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
    `;
};

export default class Cost {
  constructor(info) {
    this._element = null;
    this._info = info;
  }

  getTemplate() {
    return createCostInfo(this._info);
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

