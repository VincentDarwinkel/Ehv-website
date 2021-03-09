const apiUrl = "http://localhost:5000/";

const user = `${apiUrl}user/`;
const dashboard = `${apiUrl}dashboard/`;
const event = `${apiUrl}event/`;
const eventStep = `${apiUrl}event/step/`;
const eventStepUser = `${apiUrl}event/step/user/`;
const eventDateUser = `${apiUrl}event/date/user/`;
const log = `${apiUrl}log/`;
const eventDate = `${apiUrl}event/date/`;
const hobby = `${apiUrl}hobby/`;
const artist = `${apiUrl}artist/`;
const datePicker = `${apiUrl}datepicker/`;
const datepickerAvailability = `${apiUrl}datepicker/availability/`;

// All paths need to end with a '/'

const actions = {
  User: user,
  RefreshJwt: `${user}refresh-jwt/`,
  Login: `${user}login/`,
  Dashboard: dashboard,
  Event: event,
  EventStep: eventStep,
  EventStepUser: eventStepUser,
  EventDateUser: eventDateUser,
  ConvertDatepickerToEvent: `${event}convert-datepicker/`,
  Hobby: hobby,
  Artist: artist,
  EventDate: eventDate,
  AllUsers: user,
  UsersByUuid: `${user}by-collection/`,
  AllEvents: event,
  Log: log,
  Datepicker: datePicker,
  DatepickerAvailability: datepickerAvailability,
};

export default actions;
