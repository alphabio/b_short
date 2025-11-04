// b_path:: src/internal/collapse-handler.ts

/**
 * Collapse handler interface for reconstructing shorthand properties from longhands.
 * @module collapse-handler
 */

/**
 * Metadata for a collapse handler
 */
export interface CollapseHandlerMetadata {
  /** The shorthand property name (e.g., 'overflow') */
  shorthand: string;
  /** Array of longhand property names that can be collapsed */
  longhands: string[];
}

/**
 * Handler interface for collapsing longhand properties into shorthand values.
 *
 * Collapse handlers perform the reverse operation of expand handlers:
 * they take a set of longhand properties and reconstruct the shorthand value.
 *
 * @example
 * ```typescript
 * const collapser: CollapseHandler = {
 *   meta: {
 *     shorthand: 'overflow',
 *     longhands: ['overflow-x', 'overflow-y']
 *   },
 *   collapse(props) {
 *     const x = props['overflow-x'];
 *     const y = props['overflow-y'];
 *     if (!x || !y) return undefined;
 *     return x === y ? x : `${x} ${y}`;
 *   },
 *   canCollapse(props) {
 *     return !!(props['overflow-x'] && props['overflow-y']);
 *   }
 * };
 * ```
 */
export interface CollapseHandler {
  /**
   * Metadata describing the handler
   */
  readonly meta: CollapseHandlerMetadata;

  /**
   * Reconstruct a shorthand value from longhand properties.
   *
   * @param properties - Object containing CSS property names and values
   * @returns The reconstructed shorthand value, or undefined if cannot collapse
   *
   * @example
   * ```typescript
   * collapse({ 'overflow-x': 'hidden', 'overflow-y': 'hidden' }); // 'hidden'
   * collapse({ 'overflow-x': 'hidden', 'overflow-y': 'auto' }); // 'hidden auto'
   * collapse({ 'overflow-x': 'hidden' }); // undefined (missing overflow-y)
   * ```
   */
  collapse(properties: Record<string, string>): string | undefined;

  /**
   * Check if the given properties can be collapsed into this shorthand.
   *
   * @param properties - Object containing CSS property names and values
   * @returns true if all required longhands are present and valid
   *
   * @example
   * ```typescript
   * canCollapse({ 'overflow-x': 'hidden', 'overflow-y': 'auto' }); // true
   * canCollapse({ 'overflow-x': 'hidden' }); // false (missing overflow-y)
   * ```
   */
  canCollapse(properties: Record<string, string>): boolean;
}

/**
 * Factory function for creating collapse handlers with consistent behavior.
 *
 * @param config - Collapse handler configuration
 * @returns A fully-formed CollapseHandler instance
 *
 * @example
 * ```typescript
 * export const overflowCollapser = createCollapseHandler({
 *   meta: {
 *     shorthand: 'overflow',
 *     longhands: ['overflow-x', 'overflow-y']
 *   },
 *   collapse: (props) => {
 *     const x = props['overflow-x'];
 *     const y = props['overflow-y'];
 *     if (!x || !y) return undefined;
 *     return x === y ? x : `${x} ${y}`;
 *   },
 *   canCollapse: (props) => !!(props['overflow-x'] && props['overflow-y'])
 * });
 * ```
 */
export function createCollapseHandler(config: CollapseHandler): CollapseHandler {
  return {
    ...config,
    collapse: (properties: Record<string, string>): string | undefined => {
      try {
        return config.collapse(properties);
      } catch (_error) {
        return undefined;
      }
    },
  };
}
