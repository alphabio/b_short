// b_path:: src/handlers/grid-template/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandGridTemplate } from "./expand";

export const gridTemplateHandler: PropertyHandler = {
  meta: {
    shorthand: "grid-template",
    longhands: ["grid-template-rows", "grid-template-columns", "grid-template-areas"],
    category: "grid",
  },
  expand: (value) => expandGridTemplate(value),
};

export { expandGridTemplate };
