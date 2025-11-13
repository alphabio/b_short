// b_path:: src/handlers/border-width/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderWidth } from "./expand";

export const borderWidthHandler: PropertyHandler = {
  meta: {
    shorthand: "border-width",
    longhands: [
      "border-top-width",
      "border-right-width",
      "border-bottom-width",
      "border-left-width",
    ],
    category: "border",
  },
  expand: (value) => expandBorderWidth(value),
};

export { expandBorderWidth };
