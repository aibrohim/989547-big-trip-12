import AbstractView from "./abstract.js";

const createTripPointsList = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripPointsList extends AbstractView {
  getTemplate() {
    return createTripPointsList();
  }
}
