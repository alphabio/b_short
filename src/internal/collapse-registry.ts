// b_path:: src/internal/collapse-registry.ts

/**
 * Centralized registry for all CollapseHandler instances.
 * Maps shorthand property names to their collapse handlers.
 * @module collapse-registry
 */

import { overflowCollapser } from "../handlers/overflow/collapse";
import type { CollapseHandler } from "./collapse-handler";

/**
 * Collapse handler registry interface.
 */
export interface CollapseRegistry {
  /** Read-only map of all registered collapse handlers */
  readonly handlers: ReadonlyMap<string, CollapseHandler>;

  /** Get a collapse handler by shorthand property name */
  get(shorthand: string): CollapseHandler | undefined;

  /** Check if a shorthand has a collapse handler */
  has(shorthand: string): boolean;

  /** Get all registered shorthand property names */
  getAllShorthands(): string[];
}

/**
 * Internal map of collapse handlers.
 * Will be populated as handlers are implemented.
 * @internal
 */
const collapseHandlerMap = new Map<string, CollapseHandler>([["overflow", overflowCollapser]]);

/**
 * Global collapse handler registry.
 *
 * Provides centralized access to all CollapseHandler instances.
 *
 * @example
 * ```typescript
 * import { collapseRegistry } from 'b_short';
 *
 * // Check if collapse is supported
 * if (collapseRegistry.has('overflow')) {
 *   const handler = collapseRegistry.get('overflow');
 *   const value = handler?.collapse({ 'overflow-x': 'hidden', 'overflow-y': 'auto' });
 * }
 * ```
 */
export const collapseRegistry: CollapseRegistry = {
  handlers: collapseHandlerMap,

  get(shorthand: string): CollapseHandler | undefined {
    return collapseHandlerMap.get(shorthand);
  },

  has(shorthand: string): boolean {
    return collapseHandlerMap.has(shorthand);
  },

  getAllShorthands(): string[] {
    return Array.from(collapseHandlerMap.keys());
  },
};

/**
 * Register a collapse handler.
 * Used internally to add handlers to the registry.
 *
 * @param shorthand - The shorthand property name
 * @param handler - The collapse handler instance
 * @internal
 */
export function registerCollapseHandler(shorthand: string, handler: CollapseHandler): void {
  collapseHandlerMap.set(shorthand, handler);
}
