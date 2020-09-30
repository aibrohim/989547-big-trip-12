import AbstractView from "./abstract.js";

const createTripDaysList = () => {
  return `<ul class="trip-days">
      </ul>
    `;
};

export default class TripDaysList extends AbstractView {
  getTemplate() {
    return createTripDaysList();
  }
}
