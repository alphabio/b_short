// b_path:: src/handlers/border-block-start/expand.ts

import { parseBorderSide } from "../../internal/border-side-parser";

export function expandBorderBlockStart(value: string): Record<string, string> {
  const { width, style, color } = parseBorderSide(value);

  return {
    "border-block-start-width": width,
    "border-block-start-style": style,
    "border-block-start-color": color,
  };
}
