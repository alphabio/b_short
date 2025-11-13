// b_path:: src/handlers/object-position/expand.ts

import { parsePosition } from "../../internal/position-parser";

export function expandObjectPosition(value: string): Record<string, string> {
  const { x, y } = parsePosition(value);

  return {
    "object-position-x": x,
    "object-position-y": y,
  };
}
