import AbstractView from "./abstract.js";

const createCostInfo = (data) => {
  const totalPrice = data.reduce((total, currentData) => {
    return total + currentData.base_price;
  }, 0);

  return `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
    `;
};

export default class Cost extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createCostInfo(this._data);
  }
}

