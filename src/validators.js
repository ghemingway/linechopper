/* Copyright G. Hemingway 2020 */
"use strict";

/***
 * Make sure passed value is a specified value
 * @param pos
 * @param char
 * @returns {function(*): boolean}
 */
const Is = (pos, char) => line => line.slice(pos, pos + 1) === char;

/***
 * Skip if no valid value is passed
 * @param value
 * @param record
 * @param next
 */
const Opt = (value, record, next) => {
  if (
    (typeof value === "string" && value !== "") ||
    (typeof value === "number" && !isNaN(value)) ||
    (typeof value === "object" && value !== undefined)
  )
    next(value);
  else next(undefined);
};

/***
 * Throw error if no valid value is passed
 * @param value
 * @param record
 * @param next
 */
const Req = (value, record, next) => {
  if (
    (typeof value === "string" && value === "") ||
    (typeof value === "number" && isNaN(value)) ||
    (typeof value === "object" && value === undefined)
  )
    throw new Error(`Missing required value`);
  next(value);
};

/***
 * Skip value regardless of what it is
 * @param value
 * @param record
 * @param next
 */
const Skip = (value, record, next) => {
  next(undefined);
};

/***
 * Trim whitespace from string value
 * @param value
 * @param record
 * @param next
 */
const Trim = (value, record, next) => {
  value = value.trim();
  next(value);
};

/***
 * Numeric value, skip if it is zero, otherwise let pass
 * @param val
 * @param rec
 * @param next
 */
const SkipZero = (val, rec, next) => {
  if (!val || val === 0) next(undefined);
  next(val);
};

module.exports = {
  Is,
  Opt,
  Req,
  Skip,
  SkipZero,
  Trim
};
