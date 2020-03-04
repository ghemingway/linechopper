/* Copyright G. Hemingway 2020 */
"use strict";

/*
 *
 */
const Is = (pos, char) => line => line.slice(pos, pos + 1) === char;

/*
 *
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

/*
 *
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

/*
 *
 */
const Skip = (value, record, next) => next(undefined);

/*
 *
 */
const Trim = (value, record, next) => {
  value = value.trim();
  next(value);
};

module.exports = {
  Is,
  Opt,
  Req,
  Skip,
  Trim
};
