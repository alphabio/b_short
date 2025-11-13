// b_path:: src/handlers/border-width/expand.ts

import { expandTRBL } from "../../internal/trbl-expander";

export function expandBorderWidth(value: string): Record<string, string> {
  const { top, right, bottom, left } = expandTRBL(value);

  return {
    "border-top-width": top,
    "border-right-width": right,
    "border-bottom-width": bottom,
    "border-left-width": left,
  };
}
