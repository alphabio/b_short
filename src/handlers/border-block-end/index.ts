// b_path:: src/handlers/border-block-end/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderBlockEnd } from "./expand";

export const borderBlockEndHandler: PropertyHandler = {
  meta: {
    shorthand: "border-block-end",
    longhands: ["border-block-end-width", "border-block-end-style", "border-block-end-color"],
    category: "border",
  },
  expand: (value) => expandBorderBlockEnd(value),
};

export { expandBorderBlockEnd };
