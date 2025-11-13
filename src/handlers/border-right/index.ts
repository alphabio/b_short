// b_path:: src/handlers/border-right/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderRight } from "./expand";

export const borderRightHandler: PropertyHandler = {
  meta: {
    shorthand: "border-right",
    longhands: ["border-right-width", "border-right-style", "border-right-color"],
    category: "border",
  },
  expand: (value) => expandBorderRight(value),
};

export { expandBorderRight };
