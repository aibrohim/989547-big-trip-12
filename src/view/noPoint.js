import AbstracView from "./Abstract.js";

const noPointTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class noPoint extends AbstracView {
  getTemplate() {
    return noPointTemplate();
  }
}

