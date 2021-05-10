const gatewayUrl = "http://localhost:5000/";
const fileApiUrl = `${gatewayUrl}api/file/`;

const user = `${gatewayUrl}user/`;
const dashboard = `${gatewayUrl}dashboard/`;
const event = `${gatewayUrl}event/`;
const eventStep = `${gatewayUrl}event/step/`;
const eventStepUser = `${gatewayUrl}event/step/user/`;
const eventDateUser = `${gatewayUrl}event/date/user/`;
const log = `${gatewayUrl}log/`;
const eventDate = `${gatewayUrl}event/date/`;
const hobby = `${gatewayUrl}hobby/`;
const artist = `${gatewayUrl}artist/`;
const datePicker = `${gatewayUrl}datepicker/`;
const datepickerAvailability = `${gatewayUrl}datepicker/availability/`;
const fileApiFiles = `${fileApiUrl}file`; // this path should not end with an / since parameters are send
const fileApiDirectory = `${fileApiUrl}directory`; // this path should not end with an / since parameters are send

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
