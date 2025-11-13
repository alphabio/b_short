// b_path:: src/handlers/border-inline-start/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderInlineStart } from "./expand";

export const borderInlineStartHandler: PropertyHandler = {
  meta: {
    shorthand: "border-inline-start",
    longhands: [
      "border-inline-start-width",
      "border-inline-start-style",
      "border-inline-start-color",
    ],
    category: "border",
  },
  expand: (value) => expandBorderInlineStart(value),
};

export { expandBorderInlineStart };
