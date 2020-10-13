import {
  Runtime,
  Inspector,
  Library,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebookDisparities from "https://api.observablehq.com/d/213f377cfc2f22da.js?v=3";

// only doing this to override the `width` var; the grouped bar chart doesn't size correctly otherwise
const runtime = new Runtime(Object.assign(new Library(), { width: 960 }));

const raceKeysBase = [
  "non_hispanic_white",
  "non_hispanic_black",
  "non_hispanic_asian",
  "non_hispanic_american_indian",
  "hispanic",
  "other",
];

let data;

init();

async function init() {
  const moduleDisp = runtime.module(notebookDisparities, (name) => {
    // TODO: clean this up using a switch statement, class, etc.
    // NOTE: returning `true` bypasses the need for rendering the cell in a DOM element, but makes sure it is included
    // this is useful in case other cells depend on a cell that isn't visually rendered
    if (name === "aqLeftPad") return true;
    if (name === "viewof disp")
      return Inspector.into(
        "#observablehq-448bb8f0 .observablehq-viewof-disp"
      )();
    if (name === "disparityTableView")
      return Inspector.into(
        "#observablehq-448bb8f0 .observablehq-disparityTableView"
      )();
    if (name === "getDisparityRow") return true;
    if (name === "disparityData") return true;
    if (name === "disp")
      return {
        fulfilled(value) {
          setSelectedRace(value);
        },
      };

    // relating to "view data for a specific county"
    if (name === "viewof selectedCounty")
      return Inspector.into(
        "#observablehq-448bb8f0 .observablehq-viewof-selectedCounty"
      )();
    if (name === "disparityText")
      return Inspector.into(
        "#observablehq-448bb8f0 .observablehq-disparity-text"
      )();
    if (name === "selectedCounty")
      return {
        fulfilled(value) {
          logSelectedCounty(value);
        },
      };
    if (name === "selectedCountyData")
      return {
        fulfilled(value) {
          logCountyData(value);
        },
      };
    if (name === "maxCountyDisp") {
      return {
        fulfilled(value) {
          logMaxCountyDisparity(value);
        },
      };
    }
  });

  // populate globals
  data = await moduleDisp.value("disparityData");

  function logSelectedCounty(countyName) {
    d3.selectAll(".selected-county").text(countyName);
    console.log(countyName);
  }

  function logCountyData(data) {
    console.log(data);
    renderCountyDisparityTable(data);
  }

  function logMaxCountyDisparity(data) {
    console.log(data);
  }
}

// maybe break this up into separate tables for population & disparities?
function renderCountyDisparityTable(datum) {
  const columns = new Set(
    ["all_deaths_total", "covid_19_deaths_total"]
      .concat(raceKeysBase.map((key) => `${key}_pop`))
      .concat(raceKeysBase.map((key) => `${key}_disp`))
  );

  const transformed = Object.keys(datum)
    .filter((key) => columns.has(key))
    .reduce((acc, key) => {
      const o = {};
      o[key] = datum[key];
      acc = [...acc, o];
      return acc;
    }, []);

  console.log(transformed);

  const table = d3.select(".custom-table");
  const header = table.append("thead");
  const body = table.append("tbody");

  // header
  //   .append("tr")
  //   .selectAll(".header-cell")
  //   .data(columns)
  //   .join("th")
  //   .classed("header-cell", true)
  //   .text((d) => d);

  body
    .selectAll(".row")
    .data(transformed)
    .join("tr")
    .classed("row", true)
    .each(function (d, i) {
      const row = d3.select(this);
      const label = Object.keys(d);
      const value = Object.values(d);
      console.log(isFloat(value));
      row.append("td").classed("cell", true).text(label);
      row
        .append("td")
        .classed("cell", true)
        .text(isFloat(value) ? d3.format(".4f")(value) : value);
    });
}

function isFloat(value) {
  if (isNaN(value)) return false;
  return typeof +value === "number" && +value % 1 !== 0;
}

function setSelectedRace(value) {
  value = value.replace("non_hispanic_", "non-hispanic ").replace(/\_/i, " ");
  d3.select(".selected-race").text(value);
}
