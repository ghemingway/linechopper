/* Copyright G. Hemingway 2020 */
"use strict";

const { Switch } = require("../../src/switch");
const { Airway1 } = require("./awy1");
const { Airway2 } = require("./awy2");

/***
 * Just make sure we haven't missed any lines
 * @param state
 * @param line
 * @param i
 */
const handleMissed = (state, line, i) => {
  console.log(`Airway Missed Line (${i}): ${line}`);
};

/***
 * Base switch for Airway data
 * @type {function(...[*]=)}
 */
module.exports.AirwaySwitch = new Switch({
  // Look at the first four chars for the type of record
  is: line => line.slice(0, 4).trim(),
  cases: {
    AWY1: Airway1,
    AWY2: Airway2
  },
  def: handleMissed
});
