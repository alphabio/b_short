// b_path:: src/contain-intrinsic-size.ts
import isLength from "./internal/is-length";

export default (value: string): Record<string, string> | undefined => {
  // Handle global CSS keywords
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "contain-intrinsic-width": value,
      "contain-intrinsic-height": value,
    };
  }

  // Split values on whitespace
  const tokens = value.trim().split(/\s+/);

  // Validate token count - max 4 tokens (for two auto pairs)
  if (tokens.length > 4 || tokens.length === 0) {
    return undefined;
  }

  const result: Record<string, string> = {};

  // Parse tokens into width and height values
  let i = 0;
  const parseValue = (): string | undefined => {
    if (i >= tokens.length) return undefined;

    const token = tokens[i++];
    if (token.toLowerCase() === "auto") {
      if (i >= tokens.length) return undefined; // auto must be followed by something
      const nextToken = tokens[i++];
      if (nextToken.toLowerCase() === "none") {
        return "auto none";
      } else if (isLength(nextToken)) {
        return `auto ${nextToken}`;
      } else {
        return undefined; // invalid after auto
      }
    } else if (token.toLowerCase() === "none") {
      return "none";
    } else if (isLength(token)) {
      return token;
    } else {
      return undefined; // invalid token
    }
  };

  // Parse width value
  const widthValue = parseValue();
  if (widthValue === undefined) return undefined;

  // Parse height value (if present)
  const heightValue = parseValue();

  // If only one value provided, apply to both
  if (heightValue === undefined) {
    result["contain-intrinsic-width"] = widthValue;
    result["contain-intrinsic-height"] = widthValue;
  } else {
    // Two values provided
    result["contain-intrinsic-width"] = widthValue;
    result["contain-intrinsic-height"] = heightValue;
  }

  // Ensure no extra tokens
  if (i !== tokens.length) return undefined;

  return result;
};
