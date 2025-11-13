// b_path:: src/handlers/border-inline/expand.ts

import { parseBorderSide } from "../../internal/border-side-parser";

export function expandBorderInline(value: string): Record<string, string> {
  const { width, style, color } = parseBorderSide(value);

  return {
    "border-inline-start-width": width,
    "border-inline-start-style": style,
    "border-inline-start-color": color,
    "border-inline-end-width": width,
    "border-inline-end-style": style,
    "border-inline-end-color": color,
  };
}
