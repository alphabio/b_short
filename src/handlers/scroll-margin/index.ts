// b_path:: src/handlers/scroll-margin/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandScrollMargin } from "./expand";

export const scrollMarginHandler: PropertyHandler = {
  meta: {
    shorthand: "scroll-margin",
    longhands: [
      "scroll-margin-top",
      "scroll-margin-right",
      "scroll-margin-bottom",
      "scroll-margin-left",
    ],
    category: "box-model",
  },
  expand: (value) => expandScrollMargin(value),
};

export { expandScrollMargin };
