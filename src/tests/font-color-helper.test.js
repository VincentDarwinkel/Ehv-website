import { configure, EnzymeAdapter } from "enzyme";
import colorIsLight from "services/shared/font-color-helper";

configure({ adapter: new EnzymeAdapter() });

test("Undefined color", () => {
  expect(colorIsLight(undefined)).toEqual(false);
});

test("Empty color", () => {
  expect(colorIsLight("")).toEqual(false);
});

test("Null color", () => {
  expect(colorIsLight(null)).toEqual(false);
});

test("White color test", () => {
  expect(colorIsLight("#FFFFFF")).toEqual(true);
});

test("Black color test", () => {
  expect(colorIsLight("#000000")).toEqual(false);
});
