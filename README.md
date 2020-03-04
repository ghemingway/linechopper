# LineChopper

### Classes

#### LineChopper

LineChopper(rootSwitch, initialState = {}, options = defaultOptions)

reset()
parse()
getState()
getCount()

#### Switch

new Switch(options)

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

is: line => bool
filter: (state, line, i, prevLines) => bool
pre: (state, line, i, prevLines) => {}
post: (state, record) => {}
cases: { id: (state, line, i, prevLines) => {} }
def: (state, line, i, prevLines) => {}

#### Schema

new Schema(options, elements)

```JS
const MORA = new Schema(
  {
    name: "MORA",
    desc: "4.1.9.1",
    initialState: { vals: [] },
    post
  },
  [
    [0, 1, String, ["S", "T"], Skip, "recordType"], // 5.2 Record Type
    [4, 1, String, Skip, "section"],  // 5.4 Section Code
    [5, 1, TString, Skip, "subsection"], // 5.5 Subsection Code
    [6, 7], // Blank
    [13, 3, TString, Req, StartLat, "startLat"], // 5.141 Starting Latitude
    [16, 4, TString, Req, StartLon, "startLon"], // 5.142 Starting Longitude
    [120, 3], // Blank
    [123, 5, Number, Req, "recNum"], // 5.31 File Record Number
    [128, 4, Number, Req, "cycle"] // 5.32 Cycle
  ]
);
```
