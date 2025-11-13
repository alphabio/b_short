// b_path:: src/handlers/padding/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandPadding } from "./expand";

export const paddingHandler: PropertyHandler = {
  meta: {
    shorthand: "padding",
    longhands: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
    category: "box-model",
  },
  expand: (value) => expandPadding(value),
};

export { expandPadding };
