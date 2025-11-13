// b_path:: src/handlers/border-image/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandBorderImage } from "./expand";

export const borderImageHandler: PropertyHandler = {
  meta: {
    shorthand: "border-image",
    longhands: [
      "border-image-source",
      "border-image-slice",
      "border-image-width",
      "border-image-outset",
      "border-image-repeat",
    ],
    category: "border",
  },
  expand: (value) => expandBorderImage(value),
};

export { expandBorderImage };
