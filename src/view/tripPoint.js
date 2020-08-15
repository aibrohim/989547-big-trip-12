export const createTripPoint = (data) => {
  const {type, city, offers, about, date, cost} = data;
  const {start, finish} = date;

  const tripStartTime = () => {
    const hours = start.getHours();
    const minutes = start.getMinutes();

    return `${hours}:${minutes}`;
  };

  const tripFinishTime = () => {
    const hours = finish.getHours();
    const minutes = finish.getMinutes();

    return `${hours}:${minutes}`;
  };

  const tripDuration = () => {
    const startInSecond = start.getTime();
    const finishInSecon = finish.getTime();
    let durationSeconds = Math.floor((finishInSecon - startInSecond) / 1000);

    const durationDays = () => {
      const days = Math.floor(durationSeconds / 86400);
      durationSeconds -= (days * 86400);

      if (days === 0) {
        return ``;
      } else {
        return `${days}D `;
      }
    };

    const durationHours = () => {
      const hours = Math.floor(durationSeconds / 3600);
      durationSeconds -= (hours * 3600);

      if (hours === 0) {
        return ``;
      } else {
        return `${hours}H `;
      }
    };

    const durationMinutes = () => {
      const minutes = Math.floor(durationSeconds / 60);
      durationSeconds -= (minutes * 60);

      if (minutes === 0) {
        return ``;
      } else {
        return `${minutes}M `;
      }
    };

    return `${durationDays()}${durationHours()}${durationMinutes()}`;
  };

  return (
    `
    <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${type === `Sightseeing` || type === `Check-in` || type === `Restaurant` ? `in` : `to`} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${start.toISOString()}">${tripStartTime()}</time>
          &mdash;
          <time class="event__end-time" datetime="${finish.toISOString()}">${tripFinishTime()}</time>
        </p>
        <p class="event__duration">${tripDuration()}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${cost}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      ${offers.length === 0 ? `` : `<ul class="event__selected-offers">
      ${offers.map((offer) => {
      return `<li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.cost}</span>
       </li>`;
    }).join(``)}
    </ul>`}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
    `
  );
};
