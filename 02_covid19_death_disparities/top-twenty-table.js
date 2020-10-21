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

const formatDec2 = d3.format(".2f");
const formatPct1 = d3.format(".1%");

init();

async function init() {
  runtime.module(notebookDisparities, (name) => {
    // TODO: clean this up using a switch statement, class, etc.
    // NOTE: returning `true` bypasses the need for rendering the cell in a DOM element, but makes sure it is included
    // this is useful in case other cells depend on a cell that isn't visually rendered
    if (name === "aqLeftPad") return true;
    if (name === "viewof disp")
      return Inspector.into(
        "#observablehq-448bb8f0 .observablehq-viewof-disp"
      )();
    if (name === "getDisparityRow") return true;
    if (name === "disparityData") return true;
    if (name === "disparityTableTop20") {
      return {
        fulfilled(value) {
          renderTopTwentyTable(value);
        },
      };
    }
    if (name === "disp")
      return {
        fulfilled(value) {
          setSelectedRace(value);
        },
      };
  });
}

export function renderTopTwentyTable(table) {
  const selectedRace = d3
    .select(".observablehq-viewof-disp select")
    .property("value");

  const data = table
    .objects()
    .slice(0, 20)
    .map((d, i) => parseRow(d, i, selectedRace));

  const columns = [
    "rank",
    "county name",
    "state",
    `${prettifyRaceKey(selectedRace)} disparity`,
    `${prettifyRaceKey(selectedRace)} % population`,
    `${prettifyRaceKey(selectedRace)} % COVID-19 deaths`,
    "total all cause deaths",
    "total COVID-19 deaths",
    "urban/rural",
  ];

  const tableSel = d3.select(".table-pretty > table");

  tableSel
    .select("thead tr")
    .selectAll("th")
    .data(columns)
    .join("th")
    .text((d) => d);

  tableSel
    .select("tbody")
    .selectAll("tr")
    .data(data, (d) => d.fips)
    .join(
      (enter) => enter.append("tr").each(renderRow),
      (update) => update.each(renderRow),
      (exit) => exit.remove()
    );

  function renderRow(datum) {
    const cellData = columns.map((key) => datum[key]);
    d3.select(this)
      .selectAll("td")
      .data(cellData, (d) => d)
      .join("td")
      .text((d) => d);
  }
}

function parseRow(d, index, selectedRace) {
  const {
    fips,
    county_name,
    state,
    urbanruraldesc,
    all_deaths_total,
    covid_19_deaths_total,
  } = d;
  return {
    rank: index + 1,
    fips,
    "county name": county_name,
    state,
    "urban/rural": urbanruraldesc,
    "total all cause deaths": all_deaths_total,
    "total COVID-19 deaths": covid_19_deaths_total,
    [`${prettifyRaceKey(selectedRace)} disparity`]: formatDec2(
      d[`${selectedRace}_disp`]
    ),
    [`${prettifyRaceKey(selectedRace)} % population`]: formatPct1(
      d[`${selectedRace}_pop`]
    ),
    [`${prettifyRaceKey(selectedRace)} % COVID-19 deaths`]: formatPct1(
      d[`${selectedRace}_covid`]
    ),
  };
}

function prettifyRaceKey(key) {
  return key
    .replace(/non_hispanic/gi, "")
    .replace(/_/gi, " ")
    .trim();
}

export function setSelectedRace(value) {
  d3.select(".selected-race").text(prettifyRaceKey(value));
}
