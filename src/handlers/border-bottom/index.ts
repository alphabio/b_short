// b_path:: src/handlers/border-bottom/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderBottom } from "./expand";

export const borderBottomHandler: PropertyHandler = {
  meta: {
    shorthand: "border-bottom",
    longhands: ["border-bottom-width", "border-bottom-style", "border-bottom-color"],
    category: "border",
  },
  expand: (value) => expandBorderBottom(value),
};

export { expandBorderBottom };
