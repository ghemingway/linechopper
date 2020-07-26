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
    console.log("Unexpected JSON parsing error");
    console.log(err);
    process.exit(-1);
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
 * @returns {String}
 */
const String = (value, record, next) => next(value);

/***
 * Trimmed string
 * @param value
 * @param record
 * @param next
 * @returns {String}
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
 * @returns {String}
 */
const TLString = (value, record, next) => {
  value = value.trim().toLowerCase();
  next(value);
}

module.exports = {
  JsonObj,
  Number,
  String,
  TString,
  TLString
};
