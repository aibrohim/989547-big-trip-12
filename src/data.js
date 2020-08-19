export const CITIES = [`Dubai`, `Istanbul`, `Makkah`, `Kuala-Lumpur`, `New York`, `Moscow`, `Washington`, `California`, `Melbourne`];

export const TYPES_LIST = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

export const OFFERS = new Map([
  [`Taxi`, [
    {
      name: `Order Uber`,
      cost: `20`,
      isChecked: true
    }
  ]],
  [`Bus`, [
    {
      name: `Add luggage`,
      cost: `35`,
      isChecked: false
    },
    {
      name: `Add luggage`,
      cost: `35`,
      isChecked: false
    },
    {
      name: `Add luggage`,
      cost: `35`,
      isChecked: false
    },
    {
      name: `Add luggage`,
      cost: `35`,
      isChecked: false
    }
  ]],
  [`Train`, [
    {
      name: `Switch to comfort`,
      cost: `120`,
      isChecked: true
    },
    {
      name: `Add luggage`,
      cost: `65`,
      isChecked: false
    }
  ]],
  [`Ship`, [
    {
      name: `Switch to comfort`,
      cost: `120`,
      isChecked: true
    },
    {
      name: `Add luggage`,
      cost: `65`,
      isChecked: true
    },
    {
      name: `Order Uber`,
      cost: `15`,
      isChecked: false
    }
  ]],
  [`Transport`, [
    {
      name: `Lunch in city`,
      cost: `80`,
      isChecked: false
    },
    {
      name: `Book tickets`,
      cost: `65`,
      isChecked: true
    }
  ]],
  [`Drive`, [
    {
      name: `Add luggage`,
      cost: `20`,
      isChecked: false
    }
  ]],
  [`Flight`, [
    {
      name: `Switch to comfort`,
      cost: `80`,
      isChecked: false
    }
  ]],
  [`Check-in`, []],
  [`Sightseeing`, [
    {
      name: `Add breakfast`,
      cost: `5`,
      isChecked: true
    }
  ]],
  [`Restaurant`, [
    {
      name: `Lunch in city`,
      cost: `50`,
      isChecked: false
    },
    {
      name: `Order Uber`,
      cost: `25`,
      isChecked: true
    }
  ]],
]);

export const SENTENCES = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`
];
