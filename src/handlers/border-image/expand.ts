// b_path:: src/handlers/border-image/expand.ts

/**
 * Border-image shorthand
 * Grammar: <'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>
 *
 * Components:
 * - source: url(), gradient, none
 * - slice: 1-4 numbers/percentages + optional 'fill'
 * - width: 1-4 length/number/auto (after first /)
 * - outset: 1-4 length/number (after second /)
 * - repeat: stretch|repeat|round|space (1-2 values)
 */

const REPEAT_KEYWORDS = new Set(["stretch", "repeat", "round", "space"]);

export function expandBorderImage(value: string): Record<string, string> {
  const trimmed = value.trim();

  // Global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert" ||
    trimmed === "none"
  ) {
    const val = trimmed === "none" ? trimmed : trimmed;
    return {
      "border-image-source": val,
      "border-image-slice": val,
      "border-image-width": val,
      "border-image-outset": val,
      "border-image-repeat": val,
    };
  }

  let source = "none";
  let slice = "100%";
  let width = "1";
  let outset = "0";
  let repeat = "stretch";

  // Split by / for slice/width/outset
  const slashParts = trimmed.split("/").map((p) => p.trim());

  // First part contains source, slice, and repeat
  const mainPart = slashParts[0];
  const tokens = smartSplit(mainPart);

  const sliceTokens: string[] = [];
  const repeatTokens: string[] = [];

  for (const token of tokens) {
    // Check if it's a source (url, gradient, image-set)
    if (
      token.startsWith("url(") ||
      token.startsWith("linear-gradient(") ||
      token.startsWith("radial-gradient(") ||
      token.startsWith("image-set(")
    ) {
      source = token;
    }
    // Check if it's a repeat keyword
    else if (REPEAT_KEYWORDS.has(token)) {
      repeatTokens.push(token);
    }
    // Otherwise it's part of slice
    else {
      sliceTokens.push(token);
    }
  }

  // Build slice value
  if (sliceTokens.length > 0) {
    slice = sliceTokens.join(" ");
  }

  // Build repeat value
  if (repeatTokens.length > 0) {
    repeat = repeatTokens.join(" ");
  }

  // Handle width (after first /)
  if (slashParts.length > 1) {
    width = slashParts[1];
  }

  // Handle outset (after second /)
  if (slashParts.length > 2) {
    outset = slashParts[2];
  }

  return {
    "border-image-source": source,
    "border-image-slice": slice,
    "border-image-width": width,
    "border-image-outset": outset,
    "border-image-repeat": repeat,
  };
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
