// b_path:: src/internal/handler-registry.ts

/**
 * Centralized registry for all PropertyHandler instances.
 * Enables dynamic property lookup, introspection, and foundation for collapse API.
 * @module handler-registry
 */

// Import all 25 PropertyHandler instances
import { animationHandler } from "../handlers/animation";
import { backgroundHandler } from "../handlers/background";
import { borderHandler } from "../handlers/border";
import { borderRadiusHandler } from "../handlers/border-radius";
import { columnRuleHandler } from "../handlers/column-rule";
import { columnsHandler } from "../handlers/columns";
import { containIntrinsicSizeHandler } from "../handlers/contain-intrinsic-size";
import { flexHandler } from "../handlers/flex";
import { flexFlowHandler } from "../handlers/flex-flow";
import { fontHandler } from "../handlers/font";
import { gapHandler } from "../handlers/gap";
import { gridHandler } from "../handlers/grid";
import { gridAreaHandler } from "../handlers/grid-area";
import { gridColumnHandler } from "../handlers/grid-column";
import { gridRowHandler } from "../handlers/grid-row";
import { listStyleHandler } from "../handlers/list-style";
import { maskHandler } from "../handlers/mask";
import { offsetHandler } from "../handlers/offset";
import { outlineHandler } from "../handlers/outline";
import { overflowHandler } from "../handlers/overflow";
import { placeContentHandler } from "../handlers/place-content";
import { placeItemsHandler } from "../handlers/place-items";
import { placeSelfHandler } from "../handlers/place-self";
import { textDecorationHandler } from "../handlers/text-decoration";
import { textEmphasisHandler } from "../handlers/text-emphasis";
import { transitionHandler } from "../handlers/transition";
import type { PropertyCategory, PropertyHandler, PropertyHandlerOptions } from "./property-handler";

/**
 * Handler registry interface providing centralized access to all PropertyHandlers.
 */
export interface HandlerRegistry {
  /** Read-only map of all registered handlers */
  readonly handlers: ReadonlyMap<string, PropertyHandler>;

  /** Get a handler by shorthand property name */
  get(shorthand: string): PropertyHandler | undefined;

  /** Check if a shorthand property is registered */
  has(shorthand: string): boolean;

  /** Get all handlers in a specific category */
  getByCategory(category: PropertyCategory): PropertyHandler[];

  /** Get all registered shorthand property names */
  getAllShorthands(): string[];

  /** Get longhand properties for a shorthand */
  getLonghands(shorthand: string): string[] | undefined;

  /** Get all shorthands that include a specific longhand */
  getShorthandsForLonghand(longhand: string): string[];
}

/**
 * Internal handler map with all 25 PropertyHandlers.
 * @internal
 */
const handlerMap = new Map<string, PropertyHandler>([
  ["animation", animationHandler],
  ["background", backgroundHandler],
  ["border", borderHandler],
  ["border-radius", borderRadiusHandler],
  ["column-rule", columnRuleHandler],
  ["columns", columnsHandler],
  ["contain-intrinsic-size", containIntrinsicSizeHandler],
  ["flex", flexHandler],
  ["flex-flow", flexFlowHandler],
  ["font", fontHandler],
  ["gap", gapHandler],
  ["grid", gridHandler],
  ["grid-area", gridAreaHandler],
  ["grid-column", gridColumnHandler],
  ["grid-row", gridRowHandler],
  ["list-style", listStyleHandler],
  ["mask", maskHandler],
  ["offset", offsetHandler],
  ["outline", outlineHandler],
  ["overflow", overflowHandler],
  ["place-content", placeContentHandler],
  ["place-items", placeItemsHandler],
  ["place-self", placeSelfHandler],
  ["text-decoration", textDecorationHandler],
  ["text-emphasis", textEmphasisHandler],
  ["transition", transitionHandler],
]);

/**
 * Reverse index: longhand → shorthands[]
 * Built once at module load time for O(1) lookups.
 * @internal
 */
const longhandToShorthandsMap = new Map<string, string[]>();

// Build reverse index
for (const [shorthand, handler] of handlerMap.entries()) {
  for (const longhand of handler.meta.longhands) {
    const existing = longhandToShorthandsMap.get(longhand) ?? [];
    existing.push(shorthand);
    longhandToShorthandsMap.set(longhand, existing);
  }
}

/**
 * Global handler registry instance.
 *
 * Provides centralized access to all PropertyHandler instances, enabling:
 * - Dynamic property expansion
 * - Handler introspection
 * - Reverse longhand → shorthand lookups
 * - Category-based filtering
 *
 * @example
 * ```typescript
 * import { registry } from 'b_short';
 *
 * // Get a handler
 * const handler = registry.get('overflow');
 *
 * // Check availability
 * if (registry.has('flex-flow')) {
 *   const longhands = registry.getLonghands('flex-flow');
 * }
 *
 * // Get by category
 * const layoutHandlers = registry.getByCategory('layout');
 * ```
 */
export const registry: HandlerRegistry = {
  handlers: handlerMap,

  get(shorthand: string): PropertyHandler | undefined {
    return handlerMap.get(shorthand);
  },

  has(shorthand: string): boolean {
    return handlerMap.has(shorthand);
  },

  getByCategory(category: PropertyCategory): PropertyHandler[] {
    return Array.from(handlerMap.values()).filter((h) => h.meta.category === category);
  },

  getAllShorthands(): string[] {
    return Array.from(handlerMap.keys());
  },

  getLonghands(shorthand: string): string[] | undefined {
    return handlerMap.get(shorthand)?.meta.longhands;
  },

  getShorthandsForLonghand(longhand: string): string[] {
    return longhandToShorthandsMap.get(longhand) ?? [];
  },
};

/**
 * Dynamically expand a CSS shorthand property value.
 *
 * @param property - The shorthand property name (e.g., 'overflow', 'flex-flow')
 * @param value - The CSS value to expand
 * @param options - Optional handler options
 * @returns Expanded longhand properties, or undefined if expansion fails
 *
 * @example
 * ```typescript
 * import { expandProperty } from 'b_short';
 *
 * const result = expandProperty('overflow', 'hidden auto');
 * // { 'overflow-x': 'hidden', 'overflow-y': 'auto' }
 *
 * const invalid = expandProperty('overflow', 'not-valid');
 * // undefined
 * ```
 */
export function expandProperty(
  property: string,
  value: string,
  options?: PropertyHandlerOptions
): Record<string, string> | undefined {
  const handler = registry.get(property);
  return handler?.expand(value, options);
}

/**
 * Validate a CSS shorthand property value without expanding it.
 *
 * @param property - The shorthand property name
 * @param value - The CSS value to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```typescript
 * import { validateProperty } from 'b_short';
 *
 * validateProperty('overflow', 'hidden'); // true
 * validateProperty('overflow', 'invalid'); // false
 * validateProperty('unknown-property', 'value'); // false
 * ```
 */
export function validateProperty(property: string, value: string): boolean {
  const handler = registry.get(property);
  return handler?.validate?.(value) ?? false;
}

/**
 * Check if a CSS property is a registered shorthand.
 *
 * @param property - The property name to check
 * @returns true if the property is a registered shorthand
 *
 * @example
 * ```typescript
 * import { isShorthandProperty } from 'b_short';
 *
 * isShorthandProperty('overflow'); // true
 * isShorthandProperty('overflow-x'); // false (longhand)
 * isShorthandProperty('unknown'); // false
 * ```
 */
export function isShorthandProperty(property: string): boolean {
  return registry.has(property);
}
