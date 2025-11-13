// b_path:: src/internal/trbl-expander.ts

/**
 * TRBL (Top-Right-Bottom-Left) expander utility for box model shorthands
 *
 * Handles: margin, padding, inset, scroll-margin, scroll-padding, border-width, border-style, border-color
 *
 * CSS grammar:
 * - 1 value: all sides
 * - 2 values: vertical horizontal
 * - 3 values: top horizontal bottom
 * - 4 values: top right bottom left
 */

export interface TRBLResult {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

/**
 * Smart split that preserves function calls like calc(), var()
 */
function smartSplit(value: string): string[] {
  const result: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === " " && depth === 0) {
      if (current.trim()) {
        result.push(current.trim());
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Expand a TRBL shorthand value into individual side values
 *
 * @param value - The CSS value (e.g., "10px 20px", "1em")
 * @returns Object with top, right, bottom, left values
 *
 * @example
 * expandTRBL("10px") // { top: "10px", right: "10px", bottom: "10px", left: "10px" }
 * expandTRBL("10px 20px") // { top: "10px", right: "20px", bottom: "10px", left: "20px" }
 * expandTRBL("10px 20px 30px") // { top: "10px", right: "20px", bottom: "30px", left: "20px" }
 * expandTRBL("10px 20px 30px 40px") // { top: "10px", right: "20px", bottom: "30px", left: "40px" }
 */
export function expandTRBL(value: string): TRBLResult {
  const trimmed = value.trim();

  // Handle global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert"
  ) {
    return { top: trimmed, right: trimmed, bottom: trimmed, left: trimmed };
  }

  const parts = smartSplit(trimmed);

  if (parts.length === 0) {
    return { top: "0", right: "0", bottom: "0", left: "0" };
  }

  // 1 value: all sides
  if (parts.length === 1) {
    const val = parts[0];
    return { top: val, right: val, bottom: val, left: val };
  }

  // 2 values: vertical horizontal
  if (parts.length === 2) {
    const [vertical, horizontal] = parts;
    return { top: vertical, right: horizontal, bottom: vertical, left: horizontal };
  }

  // 3 values: top horizontal bottom
  if (parts.length === 3) {
    const [top, horizontal, bottom] = parts;
    return { top, right: horizontal, bottom, left: horizontal };
  }

  // 4 values: top right bottom left
  const [top, right, bottom, left] = parts;
  return { top, right, bottom, left };
}

/**
 * Create a TRBL property expander for a given property prefix
 *
 * @param prefix - The property prefix (e.g., "margin", "padding", "border-width")
 * @returns Function that expands the shorthand to longhand properties
 *
 * @example
 * const expandMargin = createTRBLExpander("margin");
 * expandMargin("10px 20px") // { "margin-top": "10px", "margin-right": "20px", ... }
 */
export function createTRBLExpander(prefix: string) {
  return (value: string): Record<string, string> => {
    const { top, right, bottom, left } = expandTRBL(value);
    return {
      [`${prefix}-top`]: top,
      [`${prefix}-right`]: right,
      [`${prefix}-bottom`]: bottom,
      [`${prefix}-left`]: left,
    };
  };
}
