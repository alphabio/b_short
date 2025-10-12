// b_path:: src/border-radius.ts

/**
 * Expand 1-4 values following CSS box model (top-left, top-right, bottom-right, bottom-left)
 */
const expandFourValues = (values: string[]): string[] => {
  if (values.length === 1) return [values[0], values[0], values[0], values[0]];
  if (values.length === 2) return [values[0], values[1], values[0], values[1]];
  if (values.length === 3) return [values[0], values[1], values[2], values[1]];
  if (values.length === 4) return values;
  return []; // Invalid
};

const borderRadius = (value: string): Record<string, string> | undefined => {
  // Check if there's a slash separator for horizontal/vertical radii
  const slashIndex = value.indexOf("/");

  if (slashIndex !== -1) {
    // Split horizontal and vertical radii
    const horizontalPart = value.slice(0, slashIndex).trim();
    const verticalPart = value.slice(slashIndex + 1).trim();

    const horizontalValues = horizontalPart.split(/\s+/).filter((v) => v);
    const verticalValues = verticalPart.split(/\s+/).filter((v) => v);

    // Expand both sets to 4 values
    const horizontal = expandFourValues(horizontalValues);
    const vertical = expandFourValues(verticalValues);

    if (horizontal.length === 0 || vertical.length === 0) return;

    // Combine into corner-specific values
    const corners = ["top-left", "top-right", "bottom-right", "bottom-left"];
    const result: Record<string, string> = {};

    for (let i = 0; i < 4; i++) {
      result[`border-${corners[i]}-radius`] = `${horizontal[i]} ${vertical[i]}`;
    }

    return result;
  }

  // No slash - simple case with uniform horizontal and vertical radii
  const values = value.split(/\s+/).filter((v) => v);
  const expanded = expandFourValues(values);

  if (expanded.length === 0) return;

  const corners = ["top-left", "top-right", "bottom-right", "bottom-left"];
  const result: Record<string, string> = {};

  for (let i = 0; i < 4; i++) {
    result[`border-${corners[i]}-radius`] = expanded[i];
  }

  return result;
};

export default borderRadius;
