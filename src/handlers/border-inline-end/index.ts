// b_path:: src/handlers/border-inline-end/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderInlineEnd } from "./expand";

export const borderInlineEndHandler: PropertyHandler = {
  meta: {
    shorthand: "border-inline-end",
    longhands: ["border-inline-end-width", "border-inline-end-style", "border-inline-end-color"],
    category: "border",
  },
  expand: (value) => expandBorderInlineEnd(value),
};

export { expandBorderInlineEnd };
