// b_path:: src/offset.ts
import isAngle from "./is-angle.js";
import isLength from "./is-length.js";

function splitTopLevelSlash(input: string): [string, string?] | null {
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";
  let slashIndex = -1;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false;
      quoteChar = "";
    } else if (!inQuotes) {
      if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
      } else if (char === "/" && depth === 0) {
        if (slashIndex !== -1) {
          // More than one top-level slash
          return null;
        }
        slashIndex = i;
      }
    }
  }

  if (slashIndex === -1) {
    return [input.trim()];
  }

  const main = input.slice(0, slashIndex).trim();
  const anchor = input.slice(slashIndex + 1).trim();
  return [main, anchor];
}

function tokenizeRespectingFunctions(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false;
      quoteChar = "";
      current += char;
    } else if (!inQuotes) {
      if (char === "(") {
        depth++;
        current += char;
      } else if (char === ")") {
        depth--;
        current += char;
      } else if (char === " " && depth === 0) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = "";
        }
      } else {
        current += char;
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
}

function isPositionKeyword(token: string): boolean {
  return /^(auto|normal|left|right|top|bottom|center)$/i.test(token);
}

function parsePosition(tokens: string[]): { position: string; consumed: number } | null {
  if (tokens.length === 0) return null;

  // Two tokens: x y (check first to avoid ambiguity)
  if (tokens.length >= 2) {
    const first = tokens[0];
    const second = tokens[1];
    if (
      (isPositionKeyword(first) || isLength(first)) &&
      (isPositionKeyword(second) || isLength(second))
    ) {
      return { position: `${first} ${second}`, consumed: 2 };
    }
  }

  // auto or normal
  if (tokens[0] === "auto" || tokens[0] === "normal") {
    return { position: tokens[0], consumed: 1 };
  }

  // Single keyword
  if (isPositionKeyword(tokens[0])) {
    return { position: tokens[0], consumed: 1 };
  }

  // Single length/% (horizontal center)
  if (isLength(tokens[0])) {
    return { position: tokens[0], consumed: 1 };
  }

  return null;
}

function parsePath(tokens: string[]): { path: string; consumed: number } | null {
  if (tokens.length === 0) return null;

  const token = tokens[0];

  if (token === "none") {
    return { path: "none", consumed: 1 };
  }

  if (token.startsWith("path(") || token.startsWith("ray(") || token.startsWith("url(")) {
    return { path: token, consumed: 1 };
  }

  return null;
}

function parseDistance(tokens: string[]): { distance: string; consumed: number } | null {
  if (tokens.length === 0) return null;

  if (isLength(tokens[0])) {
    return { distance: tokens[0], consumed: 1 };
  }

  return null;
}

function parseRotate(tokens: string[]): { rotate: string; consumed: number } | null {
  if (tokens.length === 0) return null;

  // Check for compound forms first: auto <angle> or reverse <angle> or <angle> auto/reverse
  if (tokens.length >= 2) {
    const first = tokens[0];
    const second = tokens[1];

    if ((first === "auto" || first === "reverse") && isAngle(second)) {
      return { rotate: `${first} ${second}`, consumed: 2 };
    }
    if (isAngle(first) && (second === "auto" || second === "reverse")) {
      return { rotate: `${second} ${first}`, consumed: 2 };
    }
  }

  // Single tokens
  const token = tokens[0];

  if (token === "auto" || token === "reverse") {
    return { rotate: token, consumed: 1 };
  }

  if (isAngle(token)) {
    return { rotate: token, consumed: 1 };
  }

  return null;
}

function parseAnchor(anchor: string): string | null {
  if (!anchor) return null;

  const tokens = tokenizeRespectingFunctions(anchor);

  if (tokens.length === 1) {
    if (tokens[0] === "auto" || isPositionKeyword(tokens[0])) {
      return tokens[0];
    }
  }

  if (tokens.length === 2) {
    if (
      (isPositionKeyword(tokens[0]) || isLength(tokens[0])) &&
      (isPositionKeyword(tokens[1]) || isLength(tokens[1]))
    ) {
      return `${tokens[0]} ${tokens[1]}`;
    }
  }

  return null;
}

export default (value: string): Record<string, string> | undefined => {
  // Handle global keywords
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "offset-position": value,
      "offset-path": value,
      "offset-distance": value,
      "offset-rotate": value,
      "offset-anchor": value,
    };
  }

  // Split on top-level slash
  const slashSplit = splitTopLevelSlash(value);
  if (!slashSplit) return undefined; // Invalid: multiple slashes

  const [main, anchor] = slashSplit;

  // Tokenize main part
  const tokens = tokenizeRespectingFunctions(main);
  if (tokens.length === 0) return undefined;

  const result: Record<string, string> = {};

  let index = 0;

  // Try to parse position first
  const positionResult = parsePosition(tokens.slice(index));
  if (positionResult) {
    result["offset-position"] = positionResult.position;
    index += positionResult.consumed;
  }

  // Try to parse path
  const pathResult = parsePath(tokens.slice(index));
  if (pathResult) {
    result["offset-path"] = pathResult.path;
    index += pathResult.consumed;
  } else {
    // Path is required unless we have position only
    if (index === 0) return undefined;
  }

  // Try to parse distance
  const distanceResult = parseDistance(tokens.slice(index));
  if (distanceResult) {
    result["offset-distance"] = distanceResult.distance;
    index += distanceResult.consumed;
  }

  // Try to parse rotate
  const rotateResult = parseRotate(tokens.slice(index));
  if (rotateResult) {
    result["offset-rotate"] = rotateResult.rotate;
    index += rotateResult.consumed;
  }

  // Check if all tokens consumed
  if (index !== tokens.length) return undefined;

  // Parse anchor if present
  if (anchor) {
    const parsedAnchor = parseAnchor(anchor);
    if (parsedAnchor === null) return undefined;
    result["offset-anchor"] = parsedAnchor;
  }

  return result;
};
