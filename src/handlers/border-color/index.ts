// b_path:: src/handlers/border-color/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderColor } from "./expand";

export const borderColorHandler: PropertyHandler = {
  meta: {
    shorthand: "border-color",
    longhands: [
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
    ],
    category: "border",
  },
  expand: (value) => expandBorderColor(value),
};

export { expandBorderColor };
