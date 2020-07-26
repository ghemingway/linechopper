# LineChopper

### Classes

#### LineChopper

LineChopper(rootSwitch, initialState = {}, options = defaultOptions)

reset()
parse()
getState()
getCount()

### Switch

Switch is an easy way to choose what type of object the line represents.

##### Switch Usage

```new Switch(options)```

##### Switch Options

A number of options are available for each Switch object.  These can aid in the processing of more complex line structures

* ```is: line => bool```
* ```filter: (state, line, i, prevLines) => bool```
* ```pre: (state, line, i, prevLines) => {}```
* ```post: (state, record) => {}```
* ```cases: { id: (state, line, i, prevLines) => {} }```
* ```def: (state, line, i, prevLines) => {}```

##### Switch Example

```JS
const SampleSwitch = new Switch({
  is: line => [line.slice(0, 3), line.slice(4, 5)],
  filter: (state, line) => line.slice(1, 4) === "USA",
  cases: {
    HDR: Header,
    A: MORA,
    D: Navaid,
    E: Enroute,
    P: Airport
  }
});
```
### Schema

Schema is the core class used for individual types of objects.

##### Schema Usage

```new Schema(options, elements)```

##### Schema Options

A number of options are available for each Schema object.  These can aid in the processing of more complex line structures

* ```name: {String} Schema name - helps with debugging output```
* ```desc: {String} Schema description - helps with documentation```
* ```allowDuplicateNames: {Boolean: default=false}```
* ```initialState: {Object} Initial state object```
* ```filter: (): Return false to not consider```
* ```pre: (state, line)```
* ```post: (state, line, i, prevLines, obj)```
* ```noGaps: {Boolean: default=true```

##### Schema Example

```JS
const MORA = new Schema(
  {
    name: "MORA",
    desc: "4.1.9.1",
    initialState: { vals: [] },
    post: (state, line, i, prevLines, obj) => {
        state.foo = obj;
    }
  },
  [
    [0, 1, String, ["S", "T"], Skip, "recordType"], // 5.2 Record Type
    [4, 1, String, Skip, "section"],  // 5.4 Section Code
    [5, 1, TString, Skip, "subsection"], // 5.5 Subsection Code
    [6, 7], // Blank
    [13, 3, TString, Req, StartLat, "startLat"], // 5.141 Starting Latitude
    [16, 4, TString, Req, StartLon, "startLon"], // 5.142 Starting Longitude
    [20, 3], // Blank
    [23, 5, Number, Req, "recNum"], // 5.31 File Record Number
    [28, 4, Number, Req, "cycle"] // 5.32 Cycle
  ]
);
```
