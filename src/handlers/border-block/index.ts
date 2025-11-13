// b_path:: src/handlers/border-block/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderBlock } from "./expand";

export const borderBlockHandler: PropertyHandler = {
  meta: {
    shorthand: "border-block",
    longhands: [
      "border-block-start-width",
      "border-block-start-style",
      "border-block-start-color",
      "border-block-end-width",
      "border-block-end-style",
      "border-block-end-color",
    ],
    category: "border",
  },
  expand: (value) => expandBorderBlock(value),
};

export { expandBorderBlock };
