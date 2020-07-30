/* Copyright G. Hemingway 2020 */
"use strict";

const { addAirway, CardinalDirections, SkipBnd, SkipZero } = require("./types");
const { Schema } = require("../../src/schema");
const { Number, TString, TLString } = require("../../src/types");
const { Opt, Skip } = require("../../src/validators");

/***
 * Airway 1 line type
 * @type {function(...[*]=)}
 */
module.exports.Airway1 = new Schema(
  {
    name: "AWY1",
    desc:
      "Basic and minimum enroute altitude (MEA) for each airway point/segment",
    initialState: { remarks: [] },
    pre: async (state, line) => {
      // What airway is the incoming line
      const designation = line
        .slice(4, 9)
        .trim()
        .toLowerCase();
      // Handle first airway - initialization
      if (state.designation) {
        // Push the prior point onto the
        state.points.push(state.point);
        // If the designator has changed, push the new airway
        if (state.designation !== designation) {
          await addAirway(state);
        }
      }
      state.designation = designation;
    },
    post: (state, line, i, prevLines, point) => {
      state.point = point;
    }
  },
  [
    [0, 4, TString, ["AWY1"], Skip], // Record type indicator
    [4, 5, TString, Skip, "designation"], // Airway designation
    [9, 1, TLString, ["", "a", "h"], "region"], // Airway type
    [10, 5, Number, Skip, "seqNum"], // Airway point sequence number
    [15, 10, TLString, Skip, "effDate"], // Chart publication effective date
    [25, 7, TLString, Opt, "trackAngleOutbound"], // Track angle outbound
    [32, 5, Number, Opt, "coDist"], // Distance to changeover point
    [37, 7, TLString, Opt, "trackAngleInbound"], // Track angle inbound
    [44, 6, Number, SkipZero, "distNext"], // Distance to next point (NM)
    [50, 6, Number, Skip, "bearing"], // Bearing (Reserved - not used)
    [56, 6, Number, Opt, "segMagCrs"], // Segment magnetic course
    [62, 6, Number, Opt, "segMagCrsOpp"], // Segment magnetic course - opposite
    [68, 6, Number, Opt, "distNextSeg"], // Distance to next point in segment (NM)
    [74, 5, Number, Opt, "mea"], // Point to point Minimum Enroute Altitude
    [79, 6, TString, Opt, "med"], // P2P minimum enroute direction
    [85, 5, Number, SkipBnd, "meaOpp"], // P2P MEA opposite direction
    [90, 6, TString, SkipBnd, CardinalDirections, "medOpp"], // P2P minimum enroute direction - opposite dir.
    [96, 5, Number, Opt, "maa"], // P2P maximum authorized altitude
    [101, 5, Number, Opt, "moca"], // P2P minimum obstruction clearance altitude
    [106, 1, TLString, Opt, ["x"], "gapFlag"], // Airway gap flag indicator
    [107, 3, Number, Opt, "distNextChange"], // Distance from this point to changeover
    [110, 5, Number, Opt, "mca"], // Minimum crossing altitude
    [115, 7, TString, SkipBnd, "mcaDir"], // Minimum crossing direction
    [122, 5, Number, Opt, "mcaOpp"], // MCA Opposite
    [127, 7, TString, SkipBnd, "mcaOppDir"], // MCA Direction opposite
    [134, 1, TLString, Opt, ["n", "y"], "signalGap"], // Gap in signal coverage indicator
    [135, 1, TLString, Opt, ["n", "y"], "usOnly"], // U.S. airspace only flag
    [136, 5, TLString, Opt, "magVar"], // Magnetic variance
    [141, 3, TLString, Opt, "artcc"], // Navaid/Fix ARTCC
    [144, 33], // Reserved (to Point-Part95)
    [177, 40], // Reserved (next MEA point-Part95)
    [217, 5, Number, SkipZero, "gps.mea"], // P2P GNSS MEA
    [222, 6, TString, SkipBnd, "gps.med"],
    [228, 5, Number, SkipZero, "gps.meaOpp"],
    [233, 6, TString, SkipBnd, "gps.medOpp"],
    [239, 40, TString, Opt, "mcaPoint"],
    [279, 5, Number, SkipZero, "dme.mea"],
    [284, 6, TString, SkipBnd, "dme.med"],
    [290, 5, Number, SkipZero, "dme.mea"],
    [295, 6, TString, SkipBnd, "dme.med"],
    [301, 1], // Blanks
    [302, 7, Number, Skip, "recSeqNum"]
  ]
);
