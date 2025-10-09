// b_path:: src/flex-flow.ts
export default function (value: string): Record<string, string> | undefined {
  // Handle global CSS keywords first
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "flex-direction": value,
      "flex-wrap": value,
    };
  }

  // Parse normal values
  const parts = value.trim().split(/\s+/);
  if (parts.length > 2) return undefined;

  // Define keyword patterns
  const directionPattern = /^(row|row-reverse|column|column-reverse)$/i;
  const wrapPattern = /^(nowrap|wrap|wrap-reverse)$/i;

  // Value classification logic
  let direction: string | undefined;
  let wrap: string | undefined;

  for (const part of parts) {
    if (directionPattern.test(part)) {
      if (direction !== undefined) return undefined; // duplicate
      direction = part;
    } else if (wrapPattern.test(part)) {
      if (wrap !== undefined) return undefined; // duplicate
      wrap = part;
    } else {
      return undefined; // invalid
    }
  }

  // Return result
  const result: Record<string, string> = {};
  if (direction) result["flex-direction"] = direction;
  if (wrap) result["flex-wrap"] = wrap;
  return Object.keys(result).length > 0 ? result : undefined;
}
