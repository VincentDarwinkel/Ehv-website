import { configure, EnzymeAdapter } from "enzyme";
import actions from "services/shared/api/ApiActions";

configure({ adapter: new EnzymeAdapter() });

test("Check if actions ends with /", () => {
  Object.values(actions).forEach((action) => {
    expect(action.substr(action.length - 1)).toEqual("/");
  });
});
