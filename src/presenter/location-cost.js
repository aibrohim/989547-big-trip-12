import LocationInfoView from "../view/location-info.js";
import CostInfoView from "../view/cost-info";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

export default class LocationCost {
  constructor(parentElement, pointsModel) {
    this._parentElement = parentElement;
    this._pointsModel = pointsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    const pointsData = this._getPoints();
    const prevLocationComponent = this._locationInfoComponent;
    const prevCostInfoComponent = this._costInfoComponent;

    this._pointsModel.addObserver(this._handleModelEvent);

    console.log(this._parentElement);

    this._locationInfoComponent = new LocationInfoView(pointsData);
    this._costInfoComponent = new CostInfoView(pointsData);

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
