// b_path:: src/handlers/scroll-padding/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandScrollPadding } from "./expand";

export const scrollPaddingHandler: PropertyHandler = {
  meta: {
    shorthand: "scroll-padding",
    longhands: [
      "scroll-padding-top",
      "scroll-padding-right",
      "scroll-padding-bottom",
      "scroll-padding-left",
    ],
    category: "box-model",
  },
  expand: (value) => expandScrollPadding(value),
};

export { expandScrollPadding };
