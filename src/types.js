/* Copyright G. Hemingway 2020 */
"use strict";

/***
 * Parse string into JSON object
 * @param value
 * @param record
 * @param next
 */
const JsonObj = (value, record, next) => {
  try {
    next(JSON.parse(value));
  } catch (err) {
    throw new Error(`Unexpected JSON parsing error: ${err}`);
  }
};

/***
 * Parse string into numeric value
 * @param value
 * @param record
 * @param next
 */
const Number = (value, record, next) => {
  value = parseFloat(value);
  next(value);
};

/***
 * Pass through string value
 * @param value
 * @param record
 * @param next
 */
const String = (value, record, next) => next(value);

/***
 * Trimmed string
 * @param value
 * @param record
 * @param next
 */
const TString = (value, record, next) => {
  value = value.trim();
  next(value);
};

/***
 * Trimmed and lower-cased string
 * @param value
 * @param record
 * @param next
 */
const TLString = (value, record, next) => {
  value = value.trim().toLowerCase();
  next(value);
};

/***
 * Parse a textual date string into a date type
 * @param val
 * @param rec
 * @param next
 */
const DateStr = (val, rec, next) => {
  if (!val || val === "") return next(undefined);
  next(new Date(val));
};

/***
 * Parse string to boolean value (yes/no || y/n)
 * @param val
 * @param rec
 * @param next
 */
const BoolYN = (val, rec, next) => {
  if (typeof val !== "string") throw new Error("Not string type");
  val = val.trim().toLowerCase();
  next(val === "y" || val === "yes");
};

/***
 * Parse string to boolean value (true/false || t/f)
 * @param val
 * @param rec
 * @param next
 * @constructor
 */
const BoolTF = (val, rec, next) => {
  if (typeof val !== "string") throw new Error("Not string type");
  val = val.trim().toLowerCase();
  next(val === "t" || val === "true");
};

module.exports = {
  JsonObj,
  Number,
  String,
  TString,
  TLString,
  DateStr,
  BoolYN,
  BoolTF
};
