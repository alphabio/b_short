// b_path:: src/handlers/border-color/expand.ts

import { expandTRBL } from "../../internal/trbl-expander";

export function expandBorderColor(value: string): Record<string, string> {
  const { top, right, bottom, left } = expandTRBL(value);

  return {
    "border-top-color": top,
    "border-right-color": right,
    "border-bottom-color": bottom,
    "border-left-color": left,
  };
}
