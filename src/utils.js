export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getSetDates = (data) => {
  const unsortedDatesMap = new Map();
  data.forEach((item) => {
    const startDate = item.date.start;
    unsortedDatesMap.set(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toString(), item);
  });
  const sortedDates = Array.from(new Set(unsortedDatesMap.keys()));

  return sortedDates;
};
