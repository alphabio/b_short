// b_path:: src/internal/is-value-node.ts
import type * as csstree from "css-tree";

/**
 * CSS functions that represent colors, not numeric values.
 * These should NOT be accepted as position/size values.
 */
const COLOR_FUNCTIONS = new Set([
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "color",
  "color-mix",
  "light-dark",
]);

/**
 * CSS functions that represent images, not numeric values.
 * These should NOT be accepted as position/size values.
 */
const IMAGE_FUNCTIONS = new Set([
  "url",
  "image",
  "image-set",
  "element",
  "linear-gradient",
  "radial-gradient",
  "conic-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeating-conic-gradient",
  "cross-fade",
  "paint",
]);

/**
 * Universal type checker that handles CSS functions intelligently.
 *
 * Use this instead of direct `node.type === "Dimension"` checks.
 * Automatically accepts calc(), var(), min(), max(), and all math functions.
 *
 * @example
 * // OLD: if (child.type === "Dimension" || child.type === "Percentage")
 * // NEW: if (matchesType(child, ["Dimension", "Percentage"]))
 *
 * @internal
 */
export function matchesType(node: csstree.CssNode | undefined, types: string | string[]): boolean {
  if (!node) return false;

  const typeArray = Array.isArray(types) ? types : [types];
  const nodeType = node.type;

  // Direct type match
  if (typeArray.includes(nodeType)) {
    return true;
  }

  // Function node: treat as numeric value unless it's a color/image function
  if (
    nodeType === "Function" &&
    (typeArray.includes("Dimension") ||
      typeArray.includes("Percentage") ||
      typeArray.includes("Number"))
  ) {
    const funcName = (node as csstree.FunctionNode).name.toLowerCase();
    return !COLOR_FUNCTIONS.has(funcName) && !IMAGE_FUNCTIONS.has(funcName);
  }

  return false;
}

/**
 * Checks if a css-tree node is a valid numeric/dimensional value type.
 * Accepts: Dimension, Percentage, Number, Function (calc, var, etc.)
 * Rejects: Color functions (rgb, hsl), Image functions (url, gradient)
 *
 * Use this for properties that accept length, percentage, or calculated values.
 *
 * @internal
 */
export function isNumericValueNode(node: csstree.CssNode): boolean {
  return matchesType(node, ["Dimension", "Percentage", "Number"]);
}

/**
 * Checks if a css-tree node is a valid position value type.
 * Accepts: Identifier (keywords), Dimension, Percentage, Number, Function
 *
 * Use this for properties like background-position, mask-position, etc.
 *
 * @param node - css-tree node to check
 * @param keywords - Optional array of valid identifier keywords (e.g., ['left', 'center', 'right'])
 * @internal
 */
export function isPositionValueNode(node: csstree.CssNode, keywords?: string[]): boolean {
  if (isNumericValueNode(node)) {
    return true;
  }

  if (node.type === "Identifier") {
    if (!keywords) return true;
    return keywords.includes((node as csstree.Identifier).name);
  }

  return false;
}

/**
 * Checks if a css-tree node is a valid size value type.
 * Accepts: Identifier (keywords), Dimension, Percentage, Number, Function
 *
 * Use this for properties like background-size, mask-size, width, height, etc.
 *
 * @param node - css-tree node to check
 * @param keywords - Optional array of valid identifier keywords (e.g., ['auto', 'cover', 'contain'])
 * @internal
 */
export function isSizeValueNode(node: csstree.CssNode, keywords?: string[]): boolean {
  return isPositionValueNode(node, keywords);
}
