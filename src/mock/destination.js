import {CITIES, SENTENCES} from "./../data.js";
import {getRandomInteger} from "./../utils/common.js";

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
    images.push({
      src: image,
      description: generateDescription()
    });
  }

  return images;
};

const destinations = {};

CITIES.forEach((city) => {
  destinations[city] = {
    "name": city,
    "pictures": generateImgLinks(),
    "description": generateDescription()
  };
});

export default destinations;
