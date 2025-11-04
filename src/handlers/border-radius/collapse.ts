// b_path:: src/handlers/border-radius/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";

/**
 * Collapse handler for the border-radius shorthand property.
 *
 * Reconstructs `border-radius` from individual corner radius properties.
 *
 * Rules:
 * - All four corner properties must be present
 * - Simplify to 1-4 values if possible
 * - Handle horizontal/vertical radii with slash syntax if needed
 */
export const borderRadiusCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "border-radius",
    longhands: [
      "border-top-left-radius",
      "border-top-right-radius",
      "border-bottom-right-radius",
      "border-bottom-left-radius",
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const tl = properties["border-top-left-radius"];
    const tr = properties["border-top-right-radius"];
    const br = properties["border-bottom-right-radius"];
    const bl = properties["border-bottom-left-radius"];

    // All four must be present
    if (!tl || !tr || !br || !bl) return undefined;

    // Parse each corner value (could be "10px" or "10px 20px")
    const parseCorner = (value: string): [string, string] => {
      const parts = value.trim().split(/\s+/);
      return parts.length === 2 ? [parts[0], parts[1]] : [parts[0], parts[0]];
    };

    const [tlH, tlV] = parseCorner(tl);
    const [trH, trV] = parseCorner(tr);
    const [brH, brV] = parseCorner(br);
    const [blH, blV] = parseCorner(bl);

    const horizontal = [tlH, trH, brH, blH];
    const vertical = [tlV, trV, brV, blV];

    // Check if horizontal and vertical are the same
    const needsSlash = !horizontal.every((h, i) => h === vertical[i]);

    // Simplify horizontal values
    const simplifyFourValues = (values: string[]): string => {
      if (values[0] === values[1] && values[1] === values[2] && values[2] === values[3]) {
        return values[0]; // All same
      }
      if (values[0] === values[2] && values[1] === values[3]) {
        return `${values[0]} ${values[1]}`; // Opposite pairs same
      }
      if (values[1] === values[3]) {
        return `${values[0]} ${values[1]} ${values[2]}`; // Left/right same
      }
      return values.join(" "); // All different
    };

    if (needsSlash) {
      const hSimplified = simplifyFourValues(horizontal);
      const vSimplified = simplifyFourValues(vertical);
      return `${hSimplified} / ${vSimplified}`;
    }

    return simplifyFourValues(horizontal);
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(
      properties["border-top-left-radius"] &&
      properties["border-top-right-radius"] &&
      properties["border-bottom-right-radius"] &&
      properties["border-bottom-left-radius"]
    );
  },
});
