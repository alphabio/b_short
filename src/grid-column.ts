// b_path:: src/grid-column.ts
import { getDefaultEnd, parseGridLine } from "./grid-line";

export default (value: string): Record<string, string> | undefined => {
  // Handle global CSS keywords
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "grid-column-start": value,
      "grid-column-end": value,
    };
  }

  // Split values on slash
  const parts = value.trim().split(/\s*\/\s*/);

  // Validate part count - max 2 parts
  if (parts.length > 2) {
    return undefined;
  }

  // Handle single value
  if (parts.length === 1) {
    const startValue = parts[0].trim();
    if (!parseGridLine(startValue)) {
      return undefined;
    }
    const endValue = getDefaultEnd(startValue);
    return {
      "grid-column-start": startValue,
      "grid-column-end": endValue,
    };
  }

  // Handle two values
  if (parts.length === 2) {
    const startValue = parts[0].trim();
    const endValue = parts[1].trim();
    if (!parseGridLine(startValue) || !parseGridLine(endValue)) {
      return undefined;
    }
    return {
      "grid-column-start": startValue,
      "grid-column-end": endValue,
    };
  }

  return undefined;
};
