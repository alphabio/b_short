// b_path:: src/internal/position-parser.ts

/**
 * Position parser utility for CSS position shorthands
 *
 * Handles: background-position, mask-position, object-position
 * Grammar: [ left | center | right | top | bottom | <length-percentage> ]
 * or [ [ left | center | right ] [ top | center | bottom ] ]
 * or [ [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] ]
 */

export interface PositionResult {
  x: string;
  y: string;
}

const POSITION_KEYWORDS = new Set(["left", "center", "right", "top", "bottom"]);
const HORIZONTAL_KEYWORDS = new Set(["left", "center", "right"]);
const VERTICAL_KEYWORDS = new Set(["top", "center", "bottom"]);

/**
 * Parse a CSS position value into x and y components
 */
export function parsePosition(value: string): PositionResult {
  const trimmed = value.trim();

  // Empty string defaults to 0% 0%
  if (!trimmed) {
    return { x: "0%", y: "0%" };
  }

  // Handle global keywords
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert"
  ) {
    return { x: trimmed, y: trimmed };
  }

  // Split by whitespace (but preserve calc(), var(), etc.)
  const parts = smartSplit(trimmed);

  if (parts.length === 0) {
    return { x: "0%", y: "0%" };
  }

  // 1-value syntax
  if (parts.length === 1) {
    const part = parts[0];

    // If it's a vertical keyword, treat as y-only
    if (VERTICAL_KEYWORDS.has(part)) {
      return { x: "center", y: part };
    }

    // If it's a horizontal keyword or length, treat as x-only
    if (HORIZONTAL_KEYWORDS.has(part) || !POSITION_KEYWORDS.has(part)) {
      return { x: part, y: "center" };
    }

    // Unknown keyword
    return { x: part, y: "center" };
  }

  // 2-value syntax
  if (parts.length === 2) {
    const [first, second] = parts;

    // Both are keywords
    if (POSITION_KEYWORDS.has(first) && POSITION_KEYWORDS.has(second)) {
      // Check if they're swapped (top/bottom first)
      if (VERTICAL_KEYWORDS.has(first) && HORIZONTAL_KEYWORDS.has(second)) {
        return { x: second, y: first };
      }
      return { x: first, y: second };
    }

    // Standard case: x y
    return { x: first, y: second };
  }

  // 3-value syntax: side offset center (edge-offset syntax)
  if (parts.length === 3) {
    const [first, second, third] = parts;

    // Pattern: left 10px center → x: left 10px, y: center
    if (HORIZONTAL_KEYWORDS.has(first) && !POSITION_KEYWORDS.has(second)) {
      return { x: `${first} ${second}`, y: third };
    }

    // Pattern: center top 10px → x: center, y: top 10px
    if (VERTICAL_KEYWORDS.has(second) && !POSITION_KEYWORDS.has(third)) {
      return { x: first, y: `${second} ${third}` };
    }

    // Pattern: center bottom 10px → x: center, y: bottom 10px
    if (!POSITION_KEYWORDS.has(first) && VERTICAL_KEYWORDS.has(second)) {
      return { x: first, y: `${second} ${third}` };
    }

    // Fallback: first is keyword, second is offset
    if (HORIZONTAL_KEYWORDS.has(first)) {
      return { x: `${first} ${second}`, y: third };
    }

    return { x: first, y: `${second} ${third}` };
  }

  // 4-value syntax: side offset side offset
  if (parts.length === 4) {
    const [first, second, third, fourth] = parts;
    return { x: `${first} ${second}`, y: `${third} ${fourth}` };
  }

  // Fallback for complex cases
  return { x: parts[0], y: parts[1] || "center" };
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
