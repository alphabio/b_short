// b_path:: src/handlers/inset-inline/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandInsetInline } from "./expand";

export const insetInlineHandler: PropertyHandler = {
  meta: {
    shorthand: "inset-inline",
    longhands: ["inset-inline-start", "inset-inline-end"],
    category: "positioning",
  },
  expand: (value) => expandInsetInline(value),
};

export { expandInsetInline };
