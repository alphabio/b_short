// b_path:: src/handlers/mask-position/expand.ts

import { parsePosition } from "../../internal/position-parser";

export function expandMaskPosition(value: string): Record<string, string> {
  const { x, y } = parsePosition(value);

  return {
    "mask-position-x": x,
    "mask-position-y": y,
  };
}
