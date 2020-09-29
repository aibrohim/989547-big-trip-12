import LocationInfoView from "./../view/locationInfo.js";
import CostInfoView from "./../view/costInfo";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

export default class LocationCost {
  constructor(parentElement, pointsModel) {
    this._parentElement = parentElement;
    this._pointsModel = pointsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevLocationComponent = this._locationInfoComponent;
    const prevCostInfoComponent = this._costInfoComponent;

    this._locationInfoComponent = new LocationInfoView(this._getPoints());
    this._costInfoComponent = new CostInfoView(this._getPoints());

    if (prevLocationComponent === undefined && prevCostInfoComponent === undefined) {
      render(this._parentElement, this._locationInfoComponent, RenderPosition.AFTERBEGIN);
      render(this._parentElement, this._costInfoComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._locationInfoComponent, prevLocationComponent);
    remove(prevLocationComponent);
    replace(this._costInfoComponent, prevCostInfoComponent);
    remove(prevCostInfoComponent);
  }

  _getPoints() {
    return this._pointsModel.getPoints().sort((a, b) => a.dateFrom - b.dateTo);
  }

  _handleModelEvent() {
    this.init();
  }
}
