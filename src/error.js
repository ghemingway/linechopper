/* Copyright G. Hemingway 2020 */
"use strict";

class SchemaError {
  constructor(schema, start, stop, value, line, i, err, field="") {
    this.schema = schema;
    this.start = start;
    this.stop = stop;
    this.value = value;
    this.line = line;
    this.i = i;
    this.err = err;
    this.field = field;
  }

  toString() {
    // Print the input line
    const iLen = this.i.toString().length;
    let retStr = `(${this.i}): ${this.line}\n`;
    // Show where on the line the error occurred
    for (let i = 0; i < this.start + 4 + iLen; i++) retStr += "-";
    retStr += "^\n";
    // Show show the error message
    retStr += `Schema: ${this.schema} on "${this.value}"`;
    retStr =  this.field !== "" ? retStr + ` for ${this.field}` : retStr;
    retStr += `\n${this.err}`;
    return retStr;
  }
}

module.exports.SchemaError = SchemaError;
