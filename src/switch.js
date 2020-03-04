/* Copyright G. Hemingway 2020 */
"use strict";

module.exports.Switch = function Switch(options) {
  const { is, filter, pre, post, cases, def } = options;
  const _isFunc = is ? is : line => line;
  const _filterFunc = filter ? filter : () => true;
  const _preFunc = pre ? pre : undefined;
  const _postFunc = post ? post : undefined;
  const _cases = cases ? cases : {};
  const _default = def ? def : () => {};
  let notFound = 0;
  // TODO: Validate cases

  /*
   * Return the line parsing function
   */
  return async (state, line, i, prevLines) => {
    const keys = Object.keys(_cases);
    let values = _isFunc(line);
    // Ensure values is an array
    values = Array.isArray(values) ? values : [values];

    // Stop processing if doesnt pass filter function
    if (!_filterFunc(state, line, i, prevLines)) return undefined;

    // Is there a preFunc
    if (_preFunc) _preFunc(state, line, i, prevLines);

    // Interim state (in case of changes)
    let found = false;
    for await (const key of keys) {
      // Does the case match any of the values
      if (values.includes(key)) {
        found = true;
        // Were we passed an object or just a simple type
        const obj = _cases[key];
        // If it is an array
        if (Array.isArray(obj)) {
          console.log(`Switch Array of Functions --- need to handle`);
          process.exit(-1);
          // If it is just a function
        } else if (typeof obj === "function") {
          let record = await obj(state, line, i, prevLines);
          // Is there a record and a postFunc
          if (_postFunc && record) _postFunc(state, record);
          return record;
          // Unexpected object
        } else if (typeof obj === "object") {
          throw new Error(`Unexpected Object`);
        }
        break;
      }
    }
    // Pass to default if not found
    if (!found) {
      let record = await _default(state, line, i, prevLines);
      // Is there a record and a postFunc
      if (_postFunc && record) _postFunc(state, record);
      return record;
    }
  };
};
