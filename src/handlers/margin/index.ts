// b_path:: src/handlers/margin/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandMargin } from "./expand";

export const marginHandler: PropertyHandler = {
  meta: {
    shorthand: "margin",
    longhands: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
    category: "box-model",
  },
  expand: (value) => expandMargin(value),
};

export { expandMargin };
