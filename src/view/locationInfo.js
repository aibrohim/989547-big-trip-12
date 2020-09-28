import AbstractView from "./Abstract.js";

const createLocationInfo = (data) => {
  const directions = () => {
    if (data.length > 3) {
      return `${data[0].city} - ... - ${data.slice(-1)[0].city}`;
    }
    return data.map((information) => information.city).join(` - `);
  };
  const sortedData = data.slice().sort((a, b) => a.dateFrom - b.dateTo);
  const minDate = sortedData[0].dateFrom;
  const maxDate = sortedData.slice(-1)[0].dateFrom;
  const monthBoolean = minDate.getMonth() === maxDate.getMonth();

  return `<div class="trip-info__main">
              <h1 class="trip-info__title">${directions()}</h1>

              <p class="trip-info__dates">${minDate.toString().slice(3, 7)} ${minDate.getDate()}&nbsp;&mdash;&nbsp;${monthBoolean ? `` : maxDate.toString().slice(3, 7)}&nbsp;${maxDate.getDate()}</p>
            </div>`;
};

export default class LocationInfo extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createLocationInfo(this._data);
  }
}
