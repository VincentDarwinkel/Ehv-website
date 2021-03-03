export function localeToISO(dateTime) {
  return new Date(Date.parse(dateTime)).toISOString();
}

export function isoToLocale(dateTime) {
  const date = new Date(dateTime);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export function getFullLocaleDatestring(date) {
  return `${getNameOfDay(isoToLocale(date))} ${isoToLocale(date).getDay()} ${getNameOfMonth(isoToLocale(date))} ${isoToLocale(
    date
  ).toLocaleTimeString()}`;
}

export function dateTodayString() {
  const today = new Date();
  return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

export function getNameOfDay(dateTime) {
  const daysInWeek = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
  return daysInWeek[dateTime.getDay()];
}

export function getNameOfMonth(dateTime) {
  const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  return monthNames[dateTime.getMonth()];
}
