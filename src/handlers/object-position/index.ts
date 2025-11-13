// b_path:: src/handlers/object-position/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandObjectPosition } from "./expand";

export const objectPositionHandler: PropertyHandler = {
  meta: {
    shorthand: "object-position",
    longhands: ["object-position-x", "object-position-y"],
    category: "position",
  },
  expand: (value) => expandObjectPosition(value),
};

export { expandObjectPosition };
