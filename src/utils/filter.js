import {FilterType} from "../consts.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => {
    const currentDate = new Date();
    return currentDate > point.dateTo;
  }),
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    const currentDate = new Date();
    return currentDate < point.dateFrom;
  }),
};
