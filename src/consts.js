export const AFTERBEGIN = `afterbegin`;
export const BEFOREEND = `beforeend`;
export const AFTEREND = `afterend`;

export const SortType = {
  DEFAULT: `default`,
  TIME: `time`,
  PRICE: `price`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  ADD_NEW_POINTS: `ADD_NEW_POINT`,
  POINTS: `POINTS`,
  STATISTICS: `STATISTICS`
};

export const EVENT_ACTION = {
  types: [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
  ],
  activities: [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`,
  ],
};

export const typeToEmoji = {
  'TAXI': `🚕`,
  'BUS': `🚌`,
  'TRAIN': `🚂`,
  'SHIP': `🛳`,
  'TRANSPORT': `🚊`,
  'DRIVE': `🚗`,
  'FLIGHT': `✈️`,
  'CHECK-IN': `🏨`,
  'SIGHTSEEING': `🏛`,
  'RESTAURANT': `🍴`,
};
