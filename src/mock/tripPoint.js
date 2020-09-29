import {getRandomInteger} from "../utils/common.js";
import {TYPES_LIST, CITIES} from "../data.js";
import destinations from "./destination.js";
import offers from "./offers.js";

export const generateId = () => Date.now() + parseInt(Math.random() * 1000, 10);

const generateType = () => {

  const randomIndex = getRandomInteger(0, TYPES_LIST.length - 1);

  return TYPES_LIST[randomIndex];
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateFromDate = () => {
  const MIN_RANDOM_START_SECONDS = 100000;
  const MAX_RANDOM_START_SECONDS = 200000000;
  const currentDate = new Date();

  const randomSeconds = getRandomInteger(MIN_RANDOM_START_SECONDS, MAX_RANDOM_START_SECONDS);

  const startDateSeconds = currentDate.getTime() + randomSeconds;
  const startDate = new Date(startDateSeconds);

  return startDate;
};

const generateToDate = () => {
  const MIN_RANDOM_FINISH_SECONDS = 300000000;
  const MAX_RANDOM_FINISH_SECONDS = 400000000;
  const currentDate = new Date();

  const randomSeconds = getRandomInteger(MIN_RANDOM_FINISH_SECONDS, MAX_RANDOM_FINISH_SECONDS);

  const finishDateSeconds = currentDate.getTime() + randomSeconds;

  const finishDate = new Date(finishDateSeconds);

  return finishDate;
};

const generateCost = () => {
  return getRandomInteger(20, 200);
};

const generateAvailableOffers = (type) => {
  const MIN_OFFERS_NUMBER = 1;
  const arrayType = offers.find((it) => it.type === type).offers;
  const MAX_OFFERS_NUMBER = arrayType.length - 1 === -1 ? 99 : arrayType.length - 1;
  const checkedOffers = [];

  if (MAX_OFFERS_NUMBER !== 99) {
    for (let i = 0; i < getRandomInteger(MIN_OFFERS_NUMBER, MAX_OFFERS_NUMBER); i++) {
      checkedOffers.push(arrayType[i]);
    }
  }

  return checkedOffers;
};

export const generateTripPoint = () => {
  const id = generateId();
  const type = generateType();
  const city = generateCity();
  const dateFrom = generateFromDate();
  const dateTo = generateToDate();
  const destination = destinations[city];
  const checkedOffers = generateAvailableOffers(type.toLowerCase());

  return {
    id,
    type,
    city,
    dateFrom,
    dateTo,
    cost: generateCost(),
    isFavourite: Boolean(getRandomInteger(0, 1)),
    destination,
    offers: checkedOffers
  };
};
