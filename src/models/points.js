import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update existing point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't deleting unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(data) {
    const adaptedPoint = Object.assign(
        {},
        data,
        {
          city: data.destination.name,
          dateFrom: new Date(data.date_from),
          dateTo: new Date(data.date_to)
        }
    );

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return adaptedPoint;
  }

  static adaptToServer(data) {
    const adaptedToServer = Object.assign(
        {},
        data,
        {
          "date_from": data.dateFrom.toISOString(),
          "date_to": data.dateTo.toISOString()
        }
    );

    delete adaptedToServer.city;
    delete adaptedToServer.dateFrom;
    delete adaptedToServer.dateTo;

    return adaptedToServer;
  }
}
