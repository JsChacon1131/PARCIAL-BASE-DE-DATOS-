const test = require("node:test");
const assert = require("node:assert/strict");
const { isPositiveInteger, isNonEmptyString, isValidEmail, isValidDate, isValidTime } =
  require("../utils/requestValidation");

test("positive IDs and capacities", () => {
  assert.equal(isPositiveInteger(1), true);
  assert.equal(isPositiveInteger("12"), true);
  for (const value of [0, -2, "1.5", "", "abc", null]) {
    assert.equal(isPositiveInteger(value), false);
  }
});

test("text and email validation", () => {
  assert.equal(isNonEmptyString("Name"), true);
  assert.equal(isNonEmptyString("  "), false);
  assert.equal(isValidEmail("contact@example.com"), true);
  assert.equal(isValidEmail("invalid-address"), false);
});

test("dates and hours validation", () => {
  assert.equal(isValidDate("2026-10-08"), true);
  assert.equal(isValidDate("2026-02-30"), false);
  assert.equal(isValidTime("08:30"), true);
  assert.equal(isValidTime("25:90"), false);
});
