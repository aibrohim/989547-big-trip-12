export const getSetDates = (data) => {
  const unsortedDatesMap = new Map();
  data.forEach((item) => {
    const startDate = item.dateFrom;
    unsortedDatesMap.set(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toString(), item);
  });
  const sortedDates = Array.from(new Set(unsortedDatesMap.keys()));

  return sortedDates;
};
