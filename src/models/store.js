export default class Store {
  constructor() {
    this._offers = [];
    this._destinations = [];
  }

  static getOffers() {
    return this._offers;
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static getDestinations() {
    return this._destinations;
  }

  static setDestinations(destinations) {
    this._destinations = destinations;
  }
}
