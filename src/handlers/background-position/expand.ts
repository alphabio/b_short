// b_path:: src/handlers/background-position/expand.ts

import { parsePosition } from "../../internal/position-parser";

/**
 * Expand background-position shorthand to longhand properties
 *
 * background-position → background-position-x, background-position-y
 */
export function expandBackgroundPosition(value: string): Record<string, string> {
  const { x, y } = parsePosition(value);

  return {
    "background-position-x": x,
    "background-position-y": y,
  };
}
