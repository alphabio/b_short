// b_path:: src/handlers/border-block-end/expand.ts

import { parseBorderSide } from "../../internal/border-side-parser";

export function expandBorderBlockEnd(value: string): Record<string, string> {
  const { width, style, color } = parseBorderSide(value);

  return {
    "border-block-end-width": width,
    "border-block-end-style": style,
    "border-block-end-color": color,
  };
}
