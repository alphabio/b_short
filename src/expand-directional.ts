// b_path:: src/expand-directional.ts

import { CSS_DEFAULTS } from "./css-defaults";

const DIRECTIONAL_SIDES = ["top", "right", "bottom", "left"] as const;
const CORNER_POSITIONS = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

/**
 * Expands partial directional properties by filling in missing sides with CSS defaults.
 *
 * Scans the result for directional keywords (top, right, bottom, left), groups them by
 * base property, and fills in any missing sides with their CSS default values.
 *
 * @param result - Object with CSS properties (kebab-case)
 * @returns New object with expanded directional properties
 *
 * @example
 * expandDirectionalProperties({ 'border-top-width': '1px' })
 * // → {
 * //     'border-top-width': '1px',
 * //     'border-right-width': 'medium',
 * //     'border-bottom-width': 'medium',
 * //     'border-left-width': 'medium'
 * //   }
 */
export function expandDirectionalProperties(
  result: Record<string, string>
): Record<string, string> {
  const groups = new Map<string, { prefix: string; suffix: string; sides: Set<string> }>();
  const cornerGroups = new Map<string, { corners: Set<string> }>();

  // Detect directional properties and group by base
  for (const property of Object.keys(result)) {
    // Check for border-radius corner properties first
    const cornerMatch = property.match(
      /^border-(top-left|top-right|bottom-right|bottom-left)-radius$/
    );
    if (cornerMatch) {
      const corner = cornerMatch[1];
      if (!cornerGroups.has("border-radius")) {
        cornerGroups.set("border-radius", { corners: new Set() });
      }
      cornerGroups.get("border-radius")!.corners.add(corner);
      continue;
    }

    // Then check for side-based directional properties
    for (const side of DIRECTIONAL_SIDES) {
      // Match the side as a complete word with hyphens
      const sidePattern = `-${side}-`;
      const sideEnd = `-${side}`;

      if (property.includes(sidePattern)) {
        // Side is in the middle (e.g., border-top-width)
        const sideIndex = property.indexOf(sidePattern);
        const prefix = property.slice(0, sideIndex + 1); // Include leading hyphen: "border-"
        const suffix = property.slice(sideIndex + side.length + 1); // After "-top": "-width"
        const baseKey = prefix + suffix; // "border--width" (will be normalized)

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }

        groups.get(baseKey)!.sides.add(side);
        break;
      } else if (property.endsWith(sideEnd)) {
        // Side is at the end (e.g., margin-top, top)
        const sideIndex = property.lastIndexOf(sideEnd);
        const prefix = property.slice(0, sideIndex + 1); // "margin-" or empty
        const suffix = ""; // Nothing after the side
        const baseKey = prefix || side; // Use side as base for properties like "top"

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }

        groups.get(baseKey)!.sides.add(side);
        break;
      } else if (property === side) {
        // Property is just the side (e.g., "top")
        const prefix = "";
        const suffix = "";
        const baseKey = "inset";

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }

        groups.get(baseKey)!.sides.add(side);
        break;
      }
    }
  }

  // If no directional groups found, return as-is
  if (groups.size === 0 && cornerGroups.size === 0) {
    return result;
  }

  const expanded: Record<string, string> = { ...result };

  // Fill missing corners for border-radius
  for (const [, group] of cornerGroups) {
    const { corners } = group;

    // If all 4 corners present, nothing to expand
    if (corners.size === 4) {
      continue;
    }

    // Add missing corners
    for (const corner of CORNER_POSITIONS) {
      if (!corners.has(corner)) {
        const fullProperty = `border-${corner}-radius`;
        const defaultValue = CSS_DEFAULTS[fullProperty];

        if (defaultValue) {
          expanded[fullProperty] = defaultValue;
        }
      }
    }
  }

  // Fill missing sides with defaults
  for (const [, group] of groups) {
    const { prefix, suffix, sides } = group;

    // If all 4 sides present, nothing to expand
    if (sides.size === 4) {
      continue;
    }

    // Add missing sides
    for (const side of DIRECTIONAL_SIDES) {
      if (!sides.has(side)) {
        // Build the full property name
        let fullProperty: string;
        if (prefix === "" && suffix === "") {
          // Just the side (top, right, bottom, left)
          fullProperty = side;
        } else if (suffix === "") {
          // prefix-side (e.g., "margin-top")
          fullProperty = `${prefix}${side}`;
        } else {
          // prefix-side-suffix (e.g., "border-top-width")
          fullProperty = `${prefix}${side}${suffix}`;
        }

        const defaultValue = CSS_DEFAULTS[fullProperty];

        if (defaultValue) {
          expanded[fullProperty] = defaultValue;
        }
      }
    }
  }

  return expanded;
}
