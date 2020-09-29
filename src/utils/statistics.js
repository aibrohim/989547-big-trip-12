import {NonTravelPoints, ActionIcon, Time} from '../consts.js';

const getTime = (start, end) => Math.round((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);

export const getPointByTypePrice = (points) => {
  const obj = {};
  points.forEach(({type, price}) => {
    if (obj[ActionIcon[type]]) {
      obj[ActionIcon[type]] += price;
    } else {
      obj[ActionIcon[type]] = price;
    }
  });

  return obj;
};

export const countTimeSpend = (points) => {
  console.log(points);
  const obj = {};

  points.forEach(({type, schedule}) => {

    if (obj[ActionIcon[type]]) {
      obj[ActionIcon[type.toLowerCase()]] += getTime(schedule.start, schedule.end);
    } else {
      obj[ActionIcon[type.toLowerCase()]] = getTime(schedule.start, schedule.end);
    }
  });
  return obj;
};

export const getTravelTypeByRepeats = (points) => {
  const obj = {};

  points
    .filter(({type}) => !NonTravelPoints.includes(type))
    .forEach(({type}) => {
      if (obj[ActionIcon[type]]) {
        obj[ActionIcon[type]]++;
      } else {
        obj[ActionIcon[type]] = 1;
      }
    });

  return obj;
};
