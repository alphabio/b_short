// b_path:: src/handlers/border-style/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderStyle } from "./expand";

export const borderStyleHandler: PropertyHandler = {
  meta: {
    shorthand: "border-style",
    longhands: [
      "border-top-style",
      "border-right-style",
      "border-bottom-style",
      "border-left-style",
    ],
    category: "border",
  },
  expand: (value) => expandBorderStyle(value),
};

export { expandBorderStyle };
