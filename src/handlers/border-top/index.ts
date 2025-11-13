// b_path:: src/handlers/border-top/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderTop } from "./expand";

export const borderTopHandler: PropertyHandler = {
  meta: {
    shorthand: "border-top",
    longhands: ["border-top-width", "border-top-style", "border-top-color"],
    category: "border",
  },
  expand: (value) => expandBorderTop(value),
};

export { expandBorderTop };
