import AbstractView from "./Abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name} = filter;

  return `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${currentFilterType === type ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`;
};

const createFilter = (filters, currentFilterType) => {
  return `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``)}

    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilter(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
