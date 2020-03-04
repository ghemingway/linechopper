/* Copyright G. Hemingway 2020 */
"use strict";

const { SchemaError } = require("./error");

const defaultLineChopperSymbol = Symbol.for("chopper:default");

const defaultOptions = {
  maxLines: 1000
};

class LineChopper {
  /*
   *
   */
  constructor(rootSwitch, initialState = {}, options = defaultOptions) {
    this.rootSwitch = rootSwitch;
    this.maxLines = options.maxLines;
    this.reset(initialState);
  }

  /*
   *
   */
  reset(initialState = {}) {
    // Initial configuration
    this.state = initialState;
    this.count = 0;
    this.prevLines = [];
  }

  /*
   *
   */
  parse(line) {
    return new Promise(async (resolve, reject) => {
      // Just call parse to base switch
      try {
        const record = await this.rootSwitch(
          this.state,
          line,
          this.count,
          this.prevLines
        );
        //if (record) console.log(record);
        // Track previous lines
        if (this.prevLines.length === this.maxLines) this.prevLines.shift();
        if (this.prevLines.length < this.maxLines) this.prevLines.push(line);
        // Get ready for next line
        this.count++;
        resolve(record);
      } catch (err) {
        if (err instanceof SchemaError) {
          console.error(err.toString());
          process.exit(-1);
        }
        reject(err);
      }
    });
  }

  /*
   *
   */
  getState() {
    return this.state;
  }

  /*
   *
   */
  getCount() {
    return this.count;
  }
}

module.exports = LineChopper;
