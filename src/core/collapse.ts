// b_path:: src/core/collapse.ts

/**
 * Main collapse API for reconstructing shorthand properties from longhands.
 * @module collapse
 */

import { collapseRegistry } from "../internal/collapse-registry";
import { registry as handlerRegistry } from "../internal/handler-registry";

/**
 * Collapse longhand properties into shorthand values where possible.
 *
 * This function analyzes a set of CSS properties and attempts to collapse
 * related longhands into their shorthand equivalents, resulting in more
 * compact CSS output.
 *
 * Algorithm:
 * 1. Identify groups of longhands that belong to the same shorthand
 * 2. For each group, check if all required longhands are present
 * 3. If yes, attempt to collapse using the registered collapse handler
 * 4. If successful, replace longhands with shorthand in output
 * 5. If not, keep the longhand properties
 *
 * @param properties - Object mapping CSS property names to values
 * @returns Object with shorthands used where possible, longhands otherwise
 *
 * @example
 * ```typescript
 * import { collapse } from 'b_short';
 *
 * // Simple case - same values
 * collapse({ 'overflow-x': 'hidden', 'overflow-y': 'hidden' });
 * // { overflow: 'hidden' }
 *
 * // Different values
 * collapse({ 'overflow-x': 'hidden', 'overflow-y': 'auto' });
 * // { overflow: 'hidden auto' }
 *
 * // Mixed - some can collapse, some can't
 * collapse({
 *   'overflow-x': 'hidden',
 *   'overflow-y': 'hidden',
 *   'margin-top': '10px',
 * });
 * // { overflow: 'hidden', 'margin-top': '10px' }
 *
 * // Missing longhands - keep as-is
 * collapse({ 'overflow-x': 'hidden' });
 * // { 'overflow-x': 'hidden' }
 * ```
 */
export function collapse(properties: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  const processedLonghands = new Set<string>();

  // Get all available shorthands that have collapse handlers
  const availableShorthands = collapseRegistry.getAllShorthands();

  // Try to collapse each shorthand
  for (const shorthand of availableShorthands) {
    const collapseHandler = collapseRegistry.get(shorthand);
    if (!collapseHandler) continue;

    // Check if we can collapse this shorthand
    if (!collapseHandler.canCollapse(properties)) continue;

    // Attempt to collapse
    const collapsedValue = collapseHandler.collapse(properties);
    if (collapsedValue === undefined) continue;

    // Success! Use the shorthand
    result[shorthand] = collapsedValue;

    // Mark these longhands as processed
    for (const longhand of collapseHandler.meta.longhands) {
      processedLonghands.add(longhand);
    }
  }

  // Add remaining properties that weren't collapsed
  for (const [prop, value] of Object.entries(properties)) {
    if (!processedLonghands.has(prop)) {
      result[prop] = value;
    }
  }

  return result;
}

/**
 * Check if a set of properties can be collapsed into any shorthand.
 *
 * @param properties - Object mapping CSS property names to values
 * @returns Array of shorthand names that could be used
 *
 * @example
 * ```typescript
 * import { getCollapsibleShorthands } from 'b_short';
 *
 * getCollapsibleShorthands({ 'overflow-x': 'hidden', 'overflow-y': 'auto' });
 * // ['overflow']
 *
 * getCollapsibleShorthands({ 'overflow-x': 'hidden' });
 * // [] (missing overflow-y)
 * ```
 */
export function getCollapsibleShorthands(properties: Record<string, string>): string[] {
  const collapsible: string[] = [];

  for (const shorthand of collapseRegistry.getAllShorthands()) {
    const handler = collapseRegistry.get(shorthand);
    if (handler?.canCollapse(properties)) {
      collapsible.push(shorthand);
    }
  }

  return collapsible;
}
