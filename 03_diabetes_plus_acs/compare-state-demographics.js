import {
  Runtime,
  Inspector,
  Library,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/@clhenrick/compare-us-state-demographics.js?v=3";

const { width } = document
  .querySelector("div.container")
  .getBoundingClientRect();
const padding = 24;

const runtime = new Runtime(
  Object.assign(new Library(), { width: width - padding * 2 })
);

runtime.module(notebook, (name) => {
  if (name === "viewof selectedStates")
    return Inspector.into(
      "#observablehq-90430437 .observablehq-viewof-selectedStates"
    )();
  if (name === "tableState1")
    return Inspector.into("#observablehq-90430437 .observablehq-tableState1")();
  if (name === "tableValuePicker1")
    return Inspector.into(
      "#observablehq-90430437 .observablehq-tableValuePicker1"
    )();
  if (name === "tableState2")
    return Inspector.into("#observablehq-90430437 .observablehq-tableState2")();
  if (name === "tableValuePicker2")
    return Inspector.into(
      "#observablehq-90430437 .observablehq-tableValuePicker2"
    )();
});
