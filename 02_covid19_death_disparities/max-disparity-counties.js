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
  runtime.module(notebook, (name) => {
    if (name === "maxDisparityLegend")
      return Inspector.into(
        "#observablehq-7447150c .observablehq-maxDisparityLegend"
      )();
    if (name === "maxDisparityByCountyBar")
      return Inspector.into(
        "#observablehq-7447150c .observablehq-maxDisparityByCountyBar"
      )();
    if (name === "maxDisparityHoveredText")
      return Inspector.into(
        "#observablehq-7447150c .observablehq-maxDisparityHoveredText"
      )();
    if (name === "viewof maxDisparityChoropleth")
      return Inspector.into(
        "#observablehq-7447150c .observablehq-viewof-maxDisparityChoropleth"
      )();
    if (name === "augmentAq") return true;
  });
}
