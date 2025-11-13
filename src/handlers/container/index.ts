// b_path:: src/handlers/container/index.ts

import type { PropertyHandler } from "../../internal/property-handler";
import { expandContainer } from "./expand";

export const containerHandler: PropertyHandler = {
  meta: {
    shorthand: "container",
    longhands: ["container-name", "container-type"],
    category: "layout",
  },
  expand: (value) => expandContainer(value),
};

export { expandContainer };
