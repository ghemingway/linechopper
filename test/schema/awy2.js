/* Copyright G. Hemingway 2020 */
"use strict";

const { Schema } = require("linechopper/src/schema");
const { Number, TString, TLString } = require("linechopper/src/types");
const { Opt, Req, Skip } = require("linechopper/src/validators");
const { latToDeg, longToDeg } = require("./types");

/***
 * Airway 2 line type
 * @type {function(...[*]=)}
 */
module.exports.Airway2 = new Schema(
  {
    initialState: { pos: [] },
    post: (state, line, i, prevLines, awy) => {
      state.point = Object.assign({}, state.point, awy);
    }
  },
  [
    [0, 4, TString, ["AWY2"], Skip],
    [4, 5, TString, Skip, "designation"],
    [9, 1, TLString, ["", "a", "h"], "region"], // Airway type - Continental US, Alaska, Hawaii
    [10, 5, Number, Skip, "seq"],
    [15, 30, TLString, Req, "name"],
    [45, 19, TLString, "type"],
    [64, 15, TLString, Opt, "fixType"],
    [79, 2, TLString, "state"],
    [81, 2, TLString, Skip, "icaoRegion"],
    [83, 14, TString, Opt, latToDeg, "pos.1"], // lat
    [97, 14, TString, Opt, longToDeg, "pos.0"], // long
    [111, 5, Number, Opt, "alt"],
    [116, 4, TLString, Opt, "navaidId"],
    [120, 40, TString, Skip], // Reserved
    [160, 142, TString, Skip], // Blanks
    [302, 7, Number, Skip, "reqNum"]
  ]
);
