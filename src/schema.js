/* Copyright G. Hemingway 2020 */
"use strict";

const { Switch } = require("./switch");
const { SchemaError } = require("./error");
const types = require("./types");
const { cloneDeep } = require("lodash");

/*
 * Initialize the schema - must validate the schema elements
 */
module.exports.Schema = function Schema(options, elementsArray) {
  // Hang onto the options
  const {
    name,
    desc,
    allowDuplicateNames = false,
    initialState,
    filter,
    pre,
    post,
    noGaps = true
  } = options;
  this.name = name ? name : "";
  this.desc = desc ? desc : "";
  this.allowDuplicateNames = allowDuplicateNames;
  this.initialState = initialState ? initialState : {};
  this.filter = filter ? filter : () => true;
  this.pre = pre ? pre : undefined;
  this.post = post ? post : undefined;
  this.elementsArray = elementsArray;

  // Validate schema
  let lastStart = -1,
    lastEnd = -1;
  let fieldNames = new Set();
  // Must have aleast one element
  if (elementsArray.length === 0)
    throw new Error(`Must have atleast one case for schema: ${this.name}`);

  elementsArray.forEach((el, i) => {
    // Check number of parameters in the element
    if (el.length < 2)
      throw new Error(
        `Line ${i}: ${el.length} unexpected number of params (${el.length})`
      );

    // Validate first parameter
    if (typeof el[0] !== "number")
      throw new Error(`Line ${i}: First param (${el[0]}) must be a number`);
    if (el[0] < lastEnd)
      throw new Error(
        `Line ${i}: First param (${el[0]}) must be > prior line end(${lastEnd})`
      );
    lastStart = el[0];

    // Check for gaps between elements
    if (el[0] > lastEnd + 1 && noGaps)
      throw new Error(`Line ${i}: Gap in sequence found`);
    // Validate second parameter type
    if (typeof el[1] !== "number")
      throw new Error(`Line ${i}: Second param (${el[1]}) must be a number`);
    // Where does this element end
    lastEnd = lastStart += el[1];

    const field3 = el[3];
    // Finish processing if this is a blank element
    if (!field3) return;

    // Check that types comes from our list of types
    const typeField = el[2];
    let validType = false;
    for (const type in types) {
      if (types[type] === typeField) validType = true;
    }
    if (!validType)
      throw new Error(
        `Line ${i}: Third param (${el[2]}) must be a LineChopper type`
      );

    // Make sure every parameter has a different field name (if present)
    if (!this.allowDuplicateNames && typeof field3 === "string") {
      if (fieldNames.has(field3))
        throw new Error(`Line ${i}: Duplicate Field Name ${el[3]}`);
      fieldNames.add(el[3]);
    }

    // TODO: Make sure at least one element isn't skipped
  });

  /*
   * Parse one structured line
   * @context prior Output from the last notable line
   */
  return async (state, line, i, prevLines) => {
    let record = cloneDeep(this.initialState);

    // Stop processing if doesnt pass filter function
    if (!this.filter(state, line, i, prevLines)) return undefined;

    // TODO: Call pre - this is probably not the right signature
    if (this.pre) this.pre(state, line, i, prevLines);

    // Iterate through every element of the record
    for (const el of this.elementsArray) {
      // Skip blank elements
      if (el.length === 2) continue;

      // Grab the value from the inputLine
      const start = el[0];
      const stop = start + el[1];
      let value = line.slice(start, stop);
      //const origValue = value;

      // Setup the middleware pipeline
      const middlewares = el.slice(2);
      let stageIndex = 0;
      while (stageIndex < middlewares.length) {
        const stage = middlewares[stageIndex];

        // Handle Schema/Switch stage
        if (stage instanceof Switch) {
          console.log("Found switch");
          stageIndex++;
        } else if (stage instanceof Schema) {
          console.log("Found Schema");
          stageIndex++;
        }

        // Handle function middleware (may return a promise)
        else if (typeof stage === "function") {
          //console.log(`Function stage: ${stageIndex}`);
          try {
            const ret = stage(value, record, returnedValue => {
              // Undefined callback value results in pipeline shortcutting
              if (returnedValue === undefined) stageIndex = middlewares.length;
              // Otherwise, capture possibly refined value
              else {
                value = returnedValue;
                stageIndex++;
              }
            });
            // Async middleware
            if (ret instanceof Promise) {
              console.log("Promise middleware");
              await ret;
              stageIndex++;
              process.exit(-1);
            }
          } catch (err) {
            // A stage can throw - it will land here
            throw new SchemaError(
              this.name,
              start,
              stop,
              value,
              line,
              i,
              err,
              middlewares[middlewares.length - 1]
            );
          }
        }

        // Handle array - i.e. validator with valid values
        else if (Array.isArray(stage)) {
          const isIn = stage.includes(value);
          const msg = `Enum Error: "${value}" not in ${JSON.stringify(stage)}`;
          if (!isIn)
            throw new SchemaError(this.name, start, stop, value, line, i, msg);
          // Otherwise, just move onto the next stage
          stageIndex++;
        }

        // Handle string middleware - i.e. place value into record with name
        else if (typeof stage === "string") {
          // Allow full paths with separator
          const parts = stage.split(".");
          if (parts.length === 1) {
            record[stage] = value;
          } else {
            let ref = record;
            const lastPath = parts[parts.length - 1];
            for (let i = 0; i < parts.length - 1; i++) {
              const path = parts[i];
              // Do we need to create this part of the path
              if (!ref.hasOwnProperty(path)) ref[path] = {};
              // Move to next part
              ref = ref[path];
            }
            ref[lastPath] = value;
          }
          stageIndex++;
        } else {
          console.log(stage);
          process.exit(-1);
        }
      }
      // End of each element in the schema
    }
    // TODO: Call post - this is probably not the right signature
    if (this.post) this.post(state, line, i, prevLines, record);
    return record;
  };
};
