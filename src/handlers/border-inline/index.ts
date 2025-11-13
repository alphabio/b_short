// b_path:: src/handlers/border-inline/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderInline } from "./expand";

export const borderInlineHandler: PropertyHandler = {
  meta: {
    shorthand: "border-inline",
    longhands: [
      "border-inline-start-width",
      "border-inline-start-style",
      "border-inline-start-color",
      "border-inline-end-width",
      "border-inline-end-style",
      "border-inline-end-color",
    ],
    category: "border",
  },
  expand: (value) => expandBorderInline(value),
};

export { expandBorderInline };
