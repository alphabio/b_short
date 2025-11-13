// b_path:: src/handlers/mask-position/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandMaskPosition } from "./expand";

export const maskPositionHandler: PropertyHandler = {
  meta: {
    shorthand: "mask-position",
    longhands: ["mask-position-x", "mask-position-y"],
    category: "position",
  },
  expand: (value) => expandMaskPosition(value),
};

export { expandMaskPosition };
