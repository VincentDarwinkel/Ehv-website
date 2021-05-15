const gatewayUrl = "http://localhost:5000/";

const user = `${gatewayUrl}user`;
const authenticate = `${gatewayUrl}authenticate`;
const dashboard = `${gatewayUrl}dashboard`;
const event = `${gatewayUrl}event`;
const eventStep = `${gatewayUrl}event/step`;
const eventStepUser = `${gatewayUrl}event/step/user`;
const eventDateUser = `${gatewayUrl}event/date/user`;
const log = `${gatewayUrl}log`;
const eventDate = `${gatewayUrl}event/date`;
const hobby = `${gatewayUrl}hobby`;
const artist = `${gatewayUrl}favorite-artist`;
const datePicker = `${gatewayUrl}datepicker`;
const datepickerAvailability = `${gatewayUrl}datepicker/availability`;
const fileApiFiles = `${gatewayUrl}file`;
const fileApiDirectory = `${gatewayUrl}directory`;

const actions = {
  User: user,
  RefreshJwt: `${authenticate}/refresh`,
  Login: authenticate,
  ActivateAccount: `${user}/activate`,
  Dashboard: dashboard,
  Event: `${event}/`,
  EventStep: eventStep,
  EventStepUser: `${eventStepUser}/`,
  EventDateUser: `${eventDateUser}/`,
  ConvertDatepickerToEvent: `${datePicker}/convert`,
  Hobby: hobby,
  Artist: artist,
  EventDate: eventDate,
  AllUsers: user,
  UsersByUuid: `${user}/by-list`,
  AllEvents: event,
  Log: log,
  Datepicker: datePicker,
  DatepickerAvailability: datepickerAvailability,
  FileApiFiles: fileApiFiles,
  FileApiDirectory: fileApiDirectory,
  FileApiDirectoryInfo: `${fileApiDirectory}/info`,
};

export default actions;
