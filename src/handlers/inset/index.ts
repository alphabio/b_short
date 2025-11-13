// b_path:: src/handlers/inset/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandInset } from "./expand";

export const insetHandler: PropertyHandler = {
  meta: {
    shorthand: "inset",
    longhands: ["top", "right", "bottom", "left"],
    category: "positioning",
  },
  expand: (value) => expandInset(value),
};

export { expandInset };
