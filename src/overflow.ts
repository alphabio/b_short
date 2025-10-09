// b_path:: src/overflow.ts
export default (value: string): Record<string, string> | undefined => {
  // Handle global CSS keywords
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "overflow-x": value,
      "overflow-y": value,
    };
  }

  // Split values on whitespace
  const values = value.trim().split(/\s+/);

  // Validate value count - max 2 values
  if (values.length > 2) {
    return undefined;
  }

  // Valid overflow values
  const validValues = /^(visible|hidden|clip|scroll|auto)$/i;

  // Handle single value - both x and y get the same value
  if (values.length === 1) {
    if (!validValues.test(values[0])) {
      return undefined;
    }
    return {
      "overflow-x": values[0],
      "overflow-y": values[0],
    };
  }

  // Handle two values - first=x, second=y
  if (values.length === 2) {
    if (!validValues.test(values[0]) || !validValues.test(values[1])) {
      return undefined;
    }
    return {
      "overflow-x": values[0],
      "overflow-y": values[1],
    };
  }

  return undefined;
};
