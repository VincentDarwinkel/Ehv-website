import { configure, EnzymeAdapter } from "enzyme";
import paths from "services/shared/router-paths";

configure({ adapter: new EnzymeAdapter() });

test("Check if paths exists", () => {
  expect(paths).toEqual({
    Root: "/",
    ForgotPassword: "/forgot-password/",
    Login: "/login/",
    Registration: "/registration/",
    RegistrationSuccess: "/registration/success",
    Dashboard: "/dashboard/",
    AppDashboard: "/app-dashboard/",
    Events: "/events/",
    Event: "/events/event/",
    DatePickers: "/datepickers/",
    AddDatepicker: "/datepickers/add/",
    EditDatepicker: "/datepicker/edit/",
    DatePicker: "/datepickers/datepicker/",
    DatePickerStatus: "/datepickers/datepicker/status/",
    DatePickerAvailability: "/datepickers/datepicker/availability",
    DatePickerForm: "/datepicker/form/",
    Gallery: "/gallery/",
    Users: "/users/",
    Account: "/account/",
    Logs: "/logs/",
    ServerManager: "/server-manager/",
  });
});
