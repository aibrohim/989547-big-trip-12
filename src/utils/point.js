export const getSetDates = (data) => {
  const unsortedDatesMap = new Map();
  data.forEach((item) => {
    const startDate = item.dateFrom;
    unsortedDatesMap.set(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toString(), item);
  });
  const sortedDates = Array.from(new Set(unsortedDatesMap.keys()));

  return sortedDates;
};

export const sortTime = (a, b) => {
  const firstDate = a.dateFrom - a.dateTo;
  const secondDate = b.dateFrom - b.dateTo;
  return firstDate - secondDate;
};

export const sortPrice = (a, b) => b.base_price - a.base_price;

export const isDatesEqual = (dateA, dateB) => {
  if (dateA.toString === dateB.toString) {
    return true;
  }

  return false;
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

