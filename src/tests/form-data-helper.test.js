import { configure, EnzymeAdapter } from "enzyme";
import { stringIsNullOrEmpty, createGuid } from "services/shared/form-data-helper";

configure({ adapter: new EnzymeAdapter() });

test("stringIsNullOrEmpty value", () => {
  expect(stringIsNullOrEmpty("123")).toEqual(false);
});

test("stringIsNullOrEmpty empty", () => {
  expect(stringIsNullOrEmpty("")).toEqual(true);
});

test("stringIsNullOrEmpty empty blank spaces", () => {
  expect(stringIsNullOrEmpty("   ")).toEqual(true);
});

test("stringIsNullOrEmpty null", () => {
  expect(stringIsNullOrEmpty(null)).toEqual(true);
});

test("stringIsNullOrEmpty undefined", () => {
  expect(stringIsNullOrEmpty(undefined)).toEqual(true);
});

test("createGuid", () => {
  expect(createGuid().length).toEqual(36);
});
