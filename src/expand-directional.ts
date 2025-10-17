// b_path:: src/expand-directional.ts

import { CSS_DEFAULTS } from "./css-defaults";

const DIRECTIONAL_SIDES = ["top", "right", "bottom", "left"] as const;
const CORNER_POSITIONS = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

/**
 * Grouping information for side-based directional properties (top, right, bottom, left).
 */
interface DirectionalGroup {
  prefix: string;
  suffix: string;
  sides: Set<string>;
}

/**
 * Grouping information for corner-based properties (top-left, top-right, etc.).
 */
interface CornerGroup {
  corners: Set<string>;
}

/**
 * Builds a full CSS property name from prefix, side, and suffix components.
 *
 * @param prefix - Property prefix (e.g., "border-", "margin-", or "")
 * @param side - Directional side (e.g., "top", "right", "bottom", "left")
 * @param suffix - Property suffix (e.g., "-width", "-style", or "")
 * @returns Full property name (e.g., "border-top-width", "margin-top", "top")
 *
 * @example
 * buildPropertyName("border-", "top", "-width") // → "border-top-width"
 * buildPropertyName("margin-", "top", "") // → "margin-top"
 * buildPropertyName("", "top", "") // → "top"
 */
function buildPropertyName(prefix: string, side: string, suffix: string): string {
  if (prefix === "" && suffix === "") {
    // Just the side (top, right, bottom, left)
    return side;
  }
  if (suffix === "") {
    // prefix-side (e.g., "margin-top")
    return `${prefix}${side}`;
  }
  // prefix-side-suffix (e.g., "border-top-width")
  return `${prefix}${side}${suffix}`;
}

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
  const groups = new Map<string, DirectionalGroup>();
  const cornerGroups = new Map<string, CornerGroup>();

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
        const baseKey = `${prefix}|${suffix}`; // Normalized grouping key

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }

        groups.get(baseKey)!.sides.add(side);
        break;
      } else if (property.endsWith(sideEnd)) {
        // Side is at the end (e.g., margin-top)
        const sideIndex = property.lastIndexOf(sideEnd);
        const prefix = property.slice(0, sideIndex + 1); // "margin-" or empty
        const suffix = ""; // Nothing after the side
        const baseKey = prefix || side; // Use prefix as key; fallback to side (bare sides handled below)

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
        const fullProperty = buildPropertyName(prefix, side, suffix);
        const defaultValue = CSS_DEFAULTS[fullProperty];

        if (defaultValue) {
          expanded[fullProperty] = defaultValue;
        }
      }
    }
  }

  return expanded;
}
