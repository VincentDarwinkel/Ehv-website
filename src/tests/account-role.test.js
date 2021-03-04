import { configure, EnzymeAdapter } from "enzyme";
import accountRole from "services/shared/account-role";

configure({ adapter: new EnzymeAdapter() });

test("Check if roles exists", () => {
  expect(accountRole.SiteAdmin).toEqual("SiteAdmin");
  expect(accountRole.Admin).toEqual("Admin");
  expect(accountRole.User).toEqual("User");
});
