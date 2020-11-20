import {
  Runtime,
  Inspector,
  Library,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/@clhenrick/compare-chronic-diseases-in-us-states-v2.js?v=3";

const { width } = document
  .querySelector("div.container")
  .getBoundingClientRect();
const padding = 24;

const runtime = new Runtime();
// Object.assign(new Library(), { width: width - padding * 2 })

const main = runtime.module(notebook, (name) => {
  if (name === "madlib")
    return Inspector.into("#observablehq-57424c04 .observablehq-madlib")();
  if (name === "mapTitle")
    return Inspector.into("#observablehq-57424c04 .observablehq-mapTitle")();
  if (name === "map")
    return Inspector.into("#observablehq-57424c04 .observablehq-map")();
  if (name === "mapLegend")
    return Inspector.into("#observablehq-57424c04 .observablehq-mapLegend")();
  if (name === "statesDiseaseTable")
    return Inspector.into(
      "#observablehq-57424c04 .observablehq-statesDiseaseTable"
    )();
  if (name === "groupedBarChart")
    return Inspector.into(
      "#observablehq-57424c04 .observablehq-groupedBarChart"
    )();
});

const columnWidth = 460;
main.redefine("mapWidth", columnWidth);
main.redefine("tableWidth", columnWidth);
main.redefine("chartWidth", columnWidth);
