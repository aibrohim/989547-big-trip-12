import AbstractView from "./abstract.js";

const createLocationCostWrapper = () => {
  return `<section class="trip-main__trip-info  trip-info">
          </section>`;
};

export default class LocationCostWrapper extends AbstractView {
  getTemplate() {
    return createLocationCostWrapper();
  }
}
