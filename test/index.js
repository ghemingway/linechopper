

const fs = require("fs");
const readline = require("readline");
const LineChopper = require("../../src");



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
