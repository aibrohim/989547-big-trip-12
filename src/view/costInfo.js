import AbstractView from "./Abstract.js";

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

export default class Cost extends AbstractView {
  constructor(info) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createCostInfo(this._info);
  }
}

