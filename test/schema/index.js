/* Copyright G. Hemingway 2020 */
"use strict";

const fs = require("fs");
const readline = require("readline");
const LineChopper = require("linechopper");
const { Switch } = require("linechopper/src/switch");

const { addAirway } = require("./types");
const { Airway1 } = require("./awy1");
const { Airway2 } = require("./awy2");
const { Airway3 } = require("./awy3");
const { Airway4 } = require("./awy4");
const { Airway5 } = require("./awy5");
const { Remark } = require("./rmk");

/***
 * Just make sure we haven't missed any lines
 * @param state
 * @param line
 * @param i
 */
const handleMissed = (state, line, i) => {
  console.log(`Airway Missed Line (${i}): ${line}`);
};

const AirwaySwitch = new Switch({
  // Look at the first four chars for the type of record
  is: line => line.slice(0, 4).trim(),
  cases: {
    AWY1: Airway1,
    AWY2: Airway2,
    AWY3: Airway3,
    AWY4: Airway4,
    AWY5: Airway5,
    RMK: Remark
  },
  def: handleMissed
});

/***
 * Primary script entry point
 * @param filename
 * @param tag
 * @param logger
 * @returns {Promise<unknown>}
 */
module.exports = (filename, tag, logger) =>
  new Promise(async (resolve, reject) => {
    try {
      const stream = fs.createReadStream(filename);
      // Handle each line
      const lineReader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
      });

      // Initial state for the dataset
      let context = {
        docVer: tag,
        points: [],
        remarks: [],
        airways: []
      };
      let chopper = new LineChopper(AirwaySwitch, context, logger);
      // Process all lines in the file
      for await (const line of lineReader) {
        await chopper.parse(line);
      }
      // Finish up the last airway - and return
      let state = chopper.getState();
      await addAirway(state);
      resolve(state.airways);
    } catch (ex) {
      // TODO: Any logging here?
      reject(ex);
    }
  });
