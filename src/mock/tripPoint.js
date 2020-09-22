import {getRandomInteger} from "../utils/common.js";
import {OFFERS, SENTENCES, TYPES_LIST, CITIES} from "../data.js";

const generateId = () => Date.now() + parseInt(Math.random() * 1000, 10);

const generateType = () => {

  const randomIndex = getRandomInteger(0, TYPES_LIST.length - 1);

  return TYPES_LIST[randomIndex];
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateDescription = () => {
  const randomIndex = getRandomInteger(1, SENTENCES.length - 1);

  const randomSentences = SENTENCES.slice(0, randomIndex).reduce((total, sentence) => total + ` ` + sentence);

  return randomSentences;
};

const generateImgLinks = () => {
  const MIN_IMAGES_NUMBER = 1;
  const MAX_IMAGES_NUMBER = 10;
  const images = [];

  for (let i = 0; i < getRandomInteger(MIN_IMAGES_NUMBER, MAX_IMAGES_NUMBER); i++) {
    let image = `http://picsum.photos/248/152?r=${Math.random()}`;
    images.push(image);
  }

  return images;
};

const generateFromDate = () => {
  const MIN_RANDOM_START_SECONDS = 100000;
  const MAX_RANDOM_START_SECONDS = 200000000;
  const currentDate = new Date();

  const randomSeconds = getRandomInteger(MIN_RANDOM_START_SECONDS, MAX_RANDOM_START_SECONDS);

  const startDateSeconds = currentDate.getTime() + randomSeconds;
  const startDate = new Date(startDateSeconds);

  return startDate;
}

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

export const generateTripPoint = () => {
  const id = generateId();
  const type = generateType();
  const city = generateCity();
  const description = generateDescription();
  const images = generateImgLinks();
  const dateFrom = generateFromDate();
  const dateTo = generateToDate();

  return {
    id,
    type,
    city,
    offers: OFFERS.get(type),
    about: {
      description,
      images
    },
    dateFrom,
    dateTo,
    cost: generateCost(),
    isFavourite: Boolean(getRandomInteger(0, 1))
  };
};
