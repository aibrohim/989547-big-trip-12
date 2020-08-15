import {getRandomInteger} from "../utils.js";
import {OFFERS, SENTENCES} from "../data.js";

const generateType = () => {
  const typesList = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

  const randomIndex = getRandomInteger(0, typesList.length - 1);

  return typesList[randomIndex];
};

const generateCity = () => {
  const citiesList = [`Dubai`, `Istanbul`, `Makkah`, `Kuala-Lumpur`, `New York`, `Moscow`, `Washingtop`, `California`, `Melbourne`];

  const randomIndex = getRandomInteger(0, citiesList.length - 1);

  return citiesList[randomIndex];
};

const generateDescription = () => {
  const randomIndex = getRandomInteger(1, SENTENCES.length - 1);

  const randomSentences = SENTENCES.slice(0, randomIndex).reduce((total, sentence) => total + ` ` + sentence);

  return randomSentences;
};

const generateImgLinks = () => {
  const images = [];

  for (let i = 0; i < getRandomInteger(1, 10); i++) {
    let image = `http://picsum.photos/248/152?r=${Math.random()}`;
    images.push(image);
  }

  return images;
};

const generateTime = () => {
  const currentDate = new Date();

  const randomIndex = getRandomInteger(100000, 900000000);

  const finishDateSeconds = currentDate.getTime() + randomIndex;

  const finishDate = new Date(finishDateSeconds);

  return {
    start: currentDate,
    finish: finishDate
  };
};

const generateCost = () => {
  return getRandomInteger(20, 200);
};

export const generateTripPoint = () => {
  const type = generateType();
  const city = generateCity();
  const description = generateDescription();
  const images = generateImgLinks();
  const date = generateTime();

  return {
    type,
    city,
    offers: OFFERS.get(type),
    about: {
      description,
      images
    },
    date,
    cost: generateCost()
  };
};
