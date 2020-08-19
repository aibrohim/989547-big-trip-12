import {createTripPoint} from "./tripPoint.js";

export const createTripDay = (date, data, index) => {

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${date.toDateString().slice(3, 7)} ${date.getDate()}</time>
      </div>
      <ul class="trip-events__list">
        ${data.map((item) => createTripPoint(item)).join(``)}
      </ul>
    </li>`
  );
};
