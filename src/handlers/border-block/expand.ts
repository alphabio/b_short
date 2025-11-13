// b_path:: src/handlers/border-block/expand.ts

import { parseBorderSide } from "../../internal/border-side-parser";

export function expandBorderBlock(value: string): Record<string, string> {
  const { width, style, color } = parseBorderSide(value);

  return {
    "border-block-start-width": width,
    "border-block-start-style": style,
    "border-block-start-color": color,
    "border-block-end-width": width,
    "border-block-end-style": style,
    "border-block-end-color": color,
  };
}
