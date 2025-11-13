// b_path:: src/handlers/inset/expand.ts

import { expandTRBL } from "../../internal/trbl-expander";

export function expandInset(value: string): Record<string, string> {
  const { top, right, bottom, left } = expandTRBL(value);

  return {
    top,
    right,
    bottom,
    left,
  };
}
