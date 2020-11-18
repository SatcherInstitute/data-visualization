import {
  Runtime,
  Inspector,
  Library,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/@clhenrick/compare-chronic-diseases-in-us-states.js?v=3";

const { width } = document
  .querySelector("div.container")
  .getBoundingClientRect();
const padding = 24;

const runtime = new Runtime(
  Object.assign(new Library(), { width: width - padding * 2 })
);

runtime.module(notebook, (name) => {
  if (name === "madlib")
    return Inspector.into("#observablehq-57424c04 .observablehq-madlib")();
  if (name === "map")
    return Inspector.into("#observablehq-57424c04 .observablehq-map")();
  if (name === "mapLegend")
    return Inspector.into("#observablehq-57424c04 .observablehq-mapLegend")();
  if (name === "tableState1")
    return Inspector.into("#observablehq-57424c04 .observablehq-tableState1")();
  if (name === "rowChartState1")
    return Inspector.into(
      "#observablehq-57424c04 .observablehq-rowChartState1"
    )();
  if (name === "tableState2")
    return Inspector.into("#observablehq-57424c04 .observablehq-tableState2")();
  if (name === "rowChartState2")
    return Inspector.into(
      "#observablehq-57424c04 .observablehq-rowChartState2"
    )();
});
