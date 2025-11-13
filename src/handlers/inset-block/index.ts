// b_path:: src/handlers/inset-block/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandInsetBlock } from "./expand";

export const insetBlockHandler: PropertyHandler = {
  meta: {
    shorthand: "inset-block",
    longhands: ["inset-block-start", "inset-block-end"],
    category: "positioning",
  },
  expand: (value) => expandInsetBlock(value),
};

export { expandInsetBlock };
