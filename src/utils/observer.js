export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((item) => item !== observer);
  }

  _notify(event, payload) {
    console.log(payload);
    this._observers.forEach((observer) => observer(event, payload));
  }
}
