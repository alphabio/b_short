// b_path:: src/internal/border-side-parser.ts

/**
 * Parse border-side shorthand (border-top, border-right, etc.)
 *
 * Grammar: <line-width> || <line-style> || <color>
 * All components are optional
 */

const BORDER_STYLES = new Set([
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
]);

const BORDER_WIDTHS = new Set(["thin", "medium", "thick"]);

export interface BorderSideResult {
  width: string;
  style: string;
  color: string;
}

export function parseBorderSide(value: string): BorderSideResult {
  const trimmed = value.trim();

  // Global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert"
  ) {
    return { width: trimmed, style: trimmed, color: trimmed };
  }

  let width = "medium";
  let style = "none";
  let color = "currentcolor";

  // Split by whitespace preserving functions
  const parts = smartSplit(trimmed);

  for (const part of parts) {
    if (BORDER_STYLES.has(part.toLowerCase())) {
      style = part;
    } else if (BORDER_WIDTHS.has(part.toLowerCase()) || isLength(part)) {
      width = part;
    } else {
      // Assume color
      color = part;
    }
  }

  return { width, style, color };
}

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

function isLength(value: string): boolean {
  if (value === "0") return true;
  if (value.startsWith("calc(")) return true;
  if (value.startsWith("var(")) return true;
  // Check for length units
  return /^-?\d*\.?\d+(px|em|rem|%|vh|vw|ch|ex|cm|mm|in|pt|pc)$/.test(value);
}

export function createBorderSideExpander(side: "top" | "right" | "bottom" | "left") {
  return (value: string): Record<string, string> => {
    const { width, style, color } = parseBorderSide(value);
    return {
      [`border-${side}-width`]: width,
      [`border-${side}-style`]: style,
      [`border-${side}-color`]: color,
    };
  };
}
