/* Copyright G. Hemingway 2020 */
"use strict";

/***
 *
 * @type {string[]}
 */
module.exports.CardinalDirections = [
  "BND",
  "SSW BN",
  "N BND",
  "S BND",
  "NE BND",
  "SW BND",
  "W BND",
  "NW BND",
  "E BND",
  "SE BND"
];

/***
 *
 * @param val
 * @param rec
 * @param next
 * @constructor
 */
module.exports.SkipBnd = (val, rec, next) => {
  if (!val || val === "" || val === "BND") next(undefined);
  next(val);
};

/***
 *
 * @param val
 * @param rec
 * @param next
 * @constructor
 */
module.exports.SkipZero = (val, rec, next) => {
  if (!val || val === 0) next(undefined);
  next(val);
};

/***
 * String Latitude to Degrees
 * @param val
 * @param rec
 * @param next
 */
module.exports.latToDeg = (val, rec, next) => {
  try {
    let parts = val.split("-");
    let deg = parseFloat(parts[0]) + parseFloat(parts[1]) / 60.0;
    deg += parseFloat(parts[2].slice(0, parts[2].length - 1)) / 3600.0;
    if (parts[2][parts[2].length - 1] === "S") deg *= -1.0;
    next(deg);
  } catch (ex) {
    throw new Error(`Invalid latitude ${val}: ${ex}`);
  }
};

/***
 * String Longitude to Degrees
 * @param val
 * @param rec
 * @param next
 */
module.exports.longToDeg = (val, rec, next) => {
  try {
    let parts = val.split("-");
    let deg = parseFloat(parts[0]) + parseFloat(parts[1]) / 60.0;
    deg += parseFloat(parts[2].slice(0, parts[2].length - 1)) / 3600.0;
    if (parts[2][parts[2].length - 1] === "W") deg *= -1.0;
    next(deg);
  } catch (ex) {
    throw new Error(`Invalid longitude ${val}: ${ex}`);
  }
};

/***
 * Done parsing all lines related to an individual airway - store into the final array
 * @param state
 * @returns {Promise<{docVer: *, length: *, designation: ({index: boolean, type: StringConstructor}|number), remarks: *, points: [], segments: *}>}
 */
module.exports.addAirway = async state => {
  const designation = state.designation;
  const airway = {
    docVer: state.docVer,
    designation,
    points: state.points,
    length,
    segments,
    remarks: state.remarks
  };
  state.remarks = [];
  // Insert the airway into the output array
  state.airways.push(airway);
  // Reset array of points
  state.points = [];
  return airway;
};
