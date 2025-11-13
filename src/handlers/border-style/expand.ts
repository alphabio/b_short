// b_path:: src/handlers/border-style/expand.ts

import { expandTRBL } from "../../internal/trbl-expander";

export function expandBorderStyle(value: string): Record<string, string> {
  const { top, right, bottom, left } = expandTRBL(value);

  return {
    "border-top-style": top,
    "border-right-style": right,
    "border-bottom-style": bottom,
    "border-left-style": left,
  };
}
