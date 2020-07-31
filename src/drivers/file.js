/* Copyright G. Hemingway 2020 */
"use strict";

const fs = require("fs");
const readline = require("readline");
const LineChopper = require("../index");

/***
 * Parse the Airports data file into a JSON structure
 * @param baseSwitch
 * @param context
 * @param filename
 * @param logger
 * @returns {Promise<results>}
 */
module.exports.FileChopper = async (baseSwitch, context, filename, logger) => {
    try {
        // Open file for reading
        const stream = fs.createReadStream(filename);
        // Handle each line
        const lineReader = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
        // Initialize the chopper with the base switch and context
        let chopper = new LineChopper(baseSwitch, context, logger);
        // Process all lines in the file
        for await (const line of lineReader) {
            await chopper.parse(line);
        }
        // Return the final state
        return chopper.getState();
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};