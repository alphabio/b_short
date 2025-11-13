// b_path:: src/handlers/border-left/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderLeft } from "./expand";

export const borderLeftHandler: PropertyHandler = {
  meta: {
    shorthand: "border-left",
    longhands: ["border-left-width", "border-left-style", "border-left-color"],
    category: "border",
  },
  expand: (value) => expandBorderLeft(value),
};

export { expandBorderLeft };
