// b_path:: src/handlers/background-position/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBackgroundPosition } from "./expand";

export const backgroundPositionHandler: PropertyHandler = {
  meta: {
    shorthand: "background-position",
    longhands: ["background-position-x", "background-position-y"],
    category: "position",
  },
  expand: (value) => expandBackgroundPosition(value),
};

export { expandBackgroundPosition };
