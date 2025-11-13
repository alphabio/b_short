// b_path:: src/internal/property-sorter.ts

import type { PropertyGrouping } from "../core/schema";
import { GROUPING_BY_PROPERTY } from "../core/schema";

/**
 * Internal property sorting utilities.
 * @internal
 */

/**
 * CSS property ordering map - defines the canonical order of properties
 * @internal
 */
export const PROPERTY_ORDER_MAP: Record<string, number> = {
  // Grid properties (indices 0-11)
  "grid-row-start": 0,
  "grid-row-end": 1,
  "grid-column-start": 2,
  "grid-column-end": 3,
  "grid-template-rows": 4,
  "grid-template-columns": 5,
  "grid-template-areas": 6,
  "grid-auto-rows": 7,
  "grid-auto-columns": 8,
  "grid-auto-flow": 9,
  "row-gap": 10,
  "column-gap": 11,

  // Animation properties (indices 20-27)
  "animation-name": 20,
  "animation-duration": 21,
  "animation-timing-function": 22,
  "animation-delay": 23,
  "animation-iteration-count": 24,
  "animation-direction": 25,
  "animation-fill-mode": 26,
  "animation-play-state": 27,

  // Transition properties (indices 30-33)
  "transition-property": 30,
  "transition-duration": 31,
  "transition-timing-function": 32,
  "transition-delay": 33,

  // Background properties (indices 40-49)
  "background-image": 40,
  "background-position": 41,
  "background-position-x": 42,
  "background-position-y": 43,
  "background-size": 44,
  "background-repeat": 45,
  "background-attachment": 46,
  "background-origin": 47,
  "background-clip": 48,
  "background-color": 49,

  // Font properties (indices 50-56)
  "font-style": 50,
  "font-variant": 51,
  "font-weight": 52,
  "font-stretch": 53,
  "font-size": 54,
  "line-height": 55,
  "font-family": 56,

  // Flex properties (indices 60-64)
  "flex-grow": 60,
  "flex-shrink": 61,
  "flex-basis": 62,
  "flex-direction": 63,
  "flex-wrap": 64,

  // Border directional properties (indices 70-84)
  "border-top-width": 70,
  "border-top-style": 71,
  "border-top-color": 72,
  "border-right-width": 73,
  "border-right-style": 74,
  "border-right-color": 75,
  "border-bottom-width": 76,
  "border-bottom-style": 77,
  "border-bottom-color": 78,
  "border-left-width": 79,
  "border-left-style": 80,
  "border-left-color": 81,
  "border-width": 82,
  "border-style": 83,
  "border-color": 84,

  // Border-radius properties (indices 90-93)
  "border-top-left-radius": 90,
  "border-top-right-radius": 91,
  "border-bottom-right-radius": 92,
  "border-bottom-left-radius": 93,

  // Outline properties (indices 100-102)
  "outline-width": 100,
  "outline-style": 101,
  "outline-color": 102,

  // Column-rule properties (indices 110-112)
  "column-rule-width": 110,
  "column-rule-style": 111,
  "column-rule-color": 112,

  // Columns properties (indices 115-116)
  "column-width": 115,
  "column-count": 116,

  // List-style properties (indices 120-122)
  "list-style-type": 120,
  "list-style-position": 121,
  "list-style-image": 122,

  // Text-decoration properties (indices 130-133)
  "text-decoration-line": 130,
  "text-decoration-style": 131,
  "text-decoration-color": 132,
  "text-decoration-thickness": 133,

  // Overflow properties (indices 140-141)
  "overflow-x": 140,
  "overflow-y": 141,

  // Place properties (indices 150-155)
  "align-items": 150,
  "justify-items": 151,
  "align-content": 152,
  "justify-content": 153,
  "align-self": 154,
  "justify-self": 155,

  // Directional properties - margin (indices 200-203)
  "margin-top": 200,
  "margin-right": 201,
  "margin-bottom": 202,
  "margin-left": 203,

  // Directional properties - padding (indices 210-213)
  "padding-top": 210,
  "padding-right": 211,
  "padding-bottom": 212,
  "padding-left": 213,

  // Directional properties - inset (indices 220-223)
  top: 220,
  right: 221,
  bottom: 222,
  left: 223,

  // Mask properties (indices 230-239)
  "mask-image": 230,
  "mask-mode": 231,
  "mask-position": 232,
  "mask-position-x": 233,
  "mask-position-y": 234,
  "mask-size": 235,
  "mask-repeat": 236,
  "mask-origin": 237,
  "mask-clip": 238,
  "mask-composite": 239,

  // Object properties (indices 245-246)
  "object-position-x": 245,
  "object-position-y": 246,

  // Offset properties (indices 240-244)
  "offset-position": 240,
  "offset-path": 241,
  "offset-distance": 242,
  "offset-rotate": 243,
  "offset-anchor": 244,

  // Text-emphasis properties (indices 250-252)
  "text-emphasis-style": 250,
  "text-emphasis-color": 251,
  "text-emphasis-position": 252,

  // Contain-intrinsic-size properties (indices 260-261)
  "contain-intrinsic-width": 260,
  "contain-intrinsic-height": 261,
};

/**
 * Sorts an object's properties according to CSS specification order.
 * @internal
 */
export function sortProperties(
  obj: Record<string, string>,
  grouping: PropertyGrouping = GROUPING_BY_PROPERTY
): Record<string, string> {
  if (grouping === "by-side") {
    return sortPropertiesBySide(obj);
  }
  return sortPropertiesByProperty(obj);
}

/**
 * Helper to extract property metadata for directional grouping.
 * @internal
 */
function getPropertyMetadata(prop: string): {
  side: string | null;
  sideIndex: number;
  base: string;
} {
  const parts = prop.split("-");
  const sides = ["top", "right", "bottom", "left"];
  const side = parts.find((p) => sides.includes(p)) || null;
  const sideIndex = side ? sides.indexOf(side) : -1;
  const base = parts[0];

  return { side, sideIndex, base };
}

/**
 * Sort properties by property type (default CSS spec order).
 * @internal
 */
function sortPropertiesByProperty(obj: Record<string, string>): Record<string, string> {
  const sortedEntries = Object.entries(obj).sort(([a], [b]) => {
    const orderA = PROPERTY_ORDER_MAP[a];
    const orderB = PROPERTY_ORDER_MAP[b];

    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;
    return a.localeCompare(b);
  });

  return Object.fromEntries(sortedEntries);
}

/**
 * Sort properties by directional side.
 * @internal
 */
function sortPropertiesBySide(obj: Record<string, string>): Record<string, string> {
  const sortedEntries = Object.entries(obj).sort(([a], [b]) => {
    const metaA = getPropertyMetadata(a);
    const metaB = getPropertyMetadata(b);

    if (metaA.side && metaB.side) {
      if (metaA.sideIndex !== metaB.sideIndex) {
        return metaA.sideIndex - metaB.sideIndex;
      }
      const orderA = PROPERTY_ORDER_MAP[a] ?? 999999;
      const orderB = PROPERTY_ORDER_MAP[b] ?? 999999;
      return orderA - orderB;
    }

    if (!metaA.side && metaB.side) {
      const orderA = PROPERTY_ORDER_MAP[a] ?? 999999;
      if (orderA < 200) return -1;
      return 1;
    }
    if (metaA.side && !metaB.side) {
      const orderB = PROPERTY_ORDER_MAP[b] ?? 999999;
      if (orderB < 200) return 1;
      return -1;
    }

    const orderA = PROPERTY_ORDER_MAP[a] ?? 999999;
    const orderB = PROPERTY_ORDER_MAP[b] ?? 999999;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  return Object.fromEntries(sortedEntries);
}

/**
 * Converts a kebab-case CSS property name to camelCase for JavaScript.
 * @internal
 */
export function kebabToCamelCase(property: string): string {
  return property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a CSS object to CSS string format.
 * @internal
 */
export function objectToCss(
  obj: Record<string, string>,
  indent: number,
  separator: string,
  propertyGrouping: PropertyGrouping = GROUPING_BY_PROPERTY
): string {
  const indentStr = "  ".repeat(indent);
  const sorted = sortProperties(obj, propertyGrouping);
  const sortedEntries = Object.entries(sorted);
  return sortedEntries.map(([key, value]) => `${indentStr}${key}: ${value};`).join(separator);
}
