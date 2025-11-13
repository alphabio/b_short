// b_path:: src/handlers/border-inline-start/expand.ts

import { parseBorderSide } from "../../internal/border-side-parser";

export function expandBorderInlineStart(value: string): Record<string, string> {
  const { width, style, color } = parseBorderSide(value);

  return {
    "border-inline-start-width": width,
    "border-inline-start-style": style,
    "border-inline-start-color": color,
  };
}
