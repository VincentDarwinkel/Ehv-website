const apiUrl = "http://localhost:5000/";
const fileApi = "http://192.168.1.31:5001/";

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
const fileApiFiles = `${fileApi}file`; // this path should not end with an / since parameters are send
const fileApiDirectory = `${fileApi}directory`; // this path should not end with an / since parameters are send

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
  FileApiFiles: fileApiFiles,
  FileApiDirectory: fileApiDirectory,
  FileApiDirectoryInfo: `${fileApiDirectory}/info`,
};

export default actions;
