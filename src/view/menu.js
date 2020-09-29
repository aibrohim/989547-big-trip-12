import AbstractView from "./Abstract.js";
import {MenuItem} from "./../consts.js";

const createMenu = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menuname="${MenuItem.POINTS}">Table</a>
        <a class="trip-tabs__btn" href="#" data-menuname="${MenuItem.STATISTICS}">Stats</a>
      </nav>
    `;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenu();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClickHandler(evt.target.dataset.menuname);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClickHandler = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-name=${menuItem}]`);

    if (item !== null) {
      item.classlist.toggle(`trip-tabs__btn--active`);
    }
  }
}
