// b_path:: src/handlers/border-inline-end/expand.ts

import { parseBorderSide } from "../../internal/border-side-parser";

export function expandBorderInlineEnd(value: string): Record<string, string> {
  const { width, style, color } = parseBorderSide(value);

  return {
    "border-inline-end-width": width,
    "border-inline-end-style": style,
    "border-inline-end-color": color,
  };
}
