/* Copyright G. Hemingway 2020 */
"use strict";

/*
 *
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

/*
 *
 */
const Number = (value, record, next) => {
  value = parseFloat(value);
  next(value);
};

/*
 *
 */
const String = (value, record, next) => next(value);

/*
 *
 */
const TString = (value, record, next) => {
  value = value.trim();
  next(value);
};

module.exports = {
  JsonObj,
  Number,
  String,
  TString
};
