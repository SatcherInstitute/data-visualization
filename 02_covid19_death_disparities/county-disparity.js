import {
  Runtime,
  Inspector,
  Library,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/d/1313b1eba78522a9.js?v=3";

// only doing this to override the `width` var; the grouped bar chart doesn't size correctly otherwise
const runtime = new Runtime(Object.assign(new Library(), { width: 960 }));

init();

export async function init() {
  const mod = runtime.module(notebook, (name) => {
    if (name === "viewof selectedCounty")
      return Inspector.into(
        "#observablehq-7447150c .observablehq-viewof-selectedCounty"
      )();

    if (name === "selectedCounty") {
      return {
        fulfilled(value) {
          renderSelectedCounty(value);
        },
      };
    }

    if (name === "defaultCounty") return true;

    if (name === "tables")
      return Inspector.into("#observablehq-7447150c .observablehq-tables")();

    if (name === "dtLegend") {
      return Inspector.into("#observablehq-7447150c .observablehq-dtLegend")();
    }

    if (name === "augmentAq") return true;
  });

  async function renderSelectedCounty(value) {
    const el = d3.select(".observablehq-selectedCounty");
    if (value) {
      el.text(value);
    } else {
      el.text(await mod.value("defaultCounty"));
    }
  }
}
