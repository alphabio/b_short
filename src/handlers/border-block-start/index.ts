// b_path:: src/handlers/border-block-start/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderBlockStart } from "./expand";

export const borderBlockStartHandler: PropertyHandler = {
  meta: {
    shorthand: "border-block-start",
    longhands: ["border-block-start-width", "border-block-start-style", "border-block-start-color"],
    category: "border",
  },
  expand: (value) => expandBorderBlockStart(value),
};

export { expandBorderBlockStart };
