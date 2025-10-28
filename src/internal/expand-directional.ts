// b_path:: src/internal/expand-directional.ts

import { CSS_DEFAULTS } from "./css-defaults";

const DIRECTIONAL_SIDES = ["top", "right", "bottom", "left"] as const;
const CORNER_POSITIONS = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

/**
 * Base key for grouping bare directional properties (top, right, bottom, left).
 * These map to the CSS `inset` logical property group.
 */
const INSET_BASE_KEY = "inset";

/**
 * Base key for grouping border-radius corner properties.
 * These share the same "border-radius" shorthand.
 */
const BORDER_RADIUS_BASE_KEY = "border-radius";

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

  // Pre-compile regex for directional property matching (more efficient than string operations)
  // Matches: -(top|right|bottom|left)- or -(top|right|bottom|left)$ or exact side
  const directionalRegex = /^(.*)-(top|right|bottom|left)(-(.*))?$|^(top|right|bottom|left)$/;

  // Detect directional properties and group by base
  for (const property of Object.keys(result)) {
    // Check for border-radius corner properties first
    const cornerMatch = property.match(
      /^border-(top-left|top-right|bottom-right|bottom-left)-radius$/
    );
    if (cornerMatch) {
      const corner = cornerMatch[1];
      if (!cornerGroups.has(BORDER_RADIUS_BASE_KEY)) {
        cornerGroups.set(BORDER_RADIUS_BASE_KEY, { corners: new Set() });
      }
      cornerGroups.get(BORDER_RADIUS_BASE_KEY)!.corners.add(corner);
      continue;
    }

    // Check for side-based directional properties using pre-compiled regex
    const match = property.match(directionalRegex);
    if (match) {
      // match[1] = prefix (if side in middle or end), match[2] = side (if hyphenated),
      // match[4] = suffix (if side in middle), match[5] = bare side
      const side = match[2] || match[5]; // Side from hyphenated or bare match

      if (!side) continue; // Shouldn't happen, but defensive check

      if (match[5]) {
        // Bare side property (e.g., "top")
        const prefix = "";
        const suffix = "";
        const baseKey = INSET_BASE_KEY;

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }
        groups.get(baseKey)!.sides.add(side);
      } else if (match[4] !== undefined) {
        // Side in the middle (e.g., border-top-width)
        const prefix = match[1] ? `${match[1]}-` : ""; // Include trailing hyphen
        const suffix = match[4] ? `-${match[4]}` : ""; // Include leading hyphen
        const baseKey = `${prefix}|${suffix}`; // Normalized grouping key

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }
        groups.get(baseKey)!.sides.add(side);
      } else {
        // Side at the end (e.g., margin-top)
        const prefix = match[1] ? `${match[1]}-` : ""; // Include trailing hyphen
        const suffix = "";
        const baseKey = prefix || side; // Use prefix as key; fallback to side

        if (!groups.has(baseKey)) {
          groups.set(baseKey, { prefix, suffix, sides: new Set() });
        }
        groups.get(baseKey)!.sides.add(side);
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
