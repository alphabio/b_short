// b_path:: src/internal/collapse-registry.ts

/**
 * Centralized registry for all CollapseHandler instances.
 * Maps shorthand property names to their collapse handlers.
 * @module collapse-registry
 */

import { borderRadiusCollapser } from "../handlers/border-radius/collapse";
import { columnRuleCollapser } from "../handlers/column-rule/collapse";
import { columnsCollapser } from "../handlers/columns/collapse";
import { containIntrinsicSizeCollapser } from "../handlers/contain-intrinsic-size/collapse";
import { flexCollapser } from "../handlers/flex/collapse";
import { flexFlowCollapser } from "../handlers/flex-flow/collapse";
import { fontCollapser } from "../handlers/font/collapse";
import { gapCollapser } from "../handlers/gap/collapse";
import { gridCollapser } from "../handlers/grid/collapse";
import { gridAreaCollapser } from "../handlers/grid-area/collapse";
import { gridColumnCollapser } from "../handlers/grid-column/collapse";
import { gridRowCollapser } from "../handlers/grid-row/collapse";
import { listStyleCollapser } from "../handlers/list-style/collapse";
import { outlineCollapser } from "../handlers/outline/collapse";
import { overflowCollapser } from "../handlers/overflow/collapse";
import { placeContentCollapser } from "../handlers/place-content/collapse";
import { placeItemsCollapser } from "../handlers/place-items/collapse";
import { placeSelfCollapser } from "../handlers/place-self/collapse";
import { textDecorationCollapser } from "../handlers/text-decoration/collapse";
import { textEmphasisCollapser } from "../handlers/text-emphasis/collapse";
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
const collapseHandlerMap = new Map<string, CollapseHandler>([
  ["border-radius", borderRadiusCollapser],
  ["column-rule", columnRuleCollapser],
  ["columns", columnsCollapser],
  ["contain-intrinsic-size", containIntrinsicSizeCollapser],
  ["flex", flexCollapser],
  ["flex-flow", flexFlowCollapser],
  ["font", fontCollapser],
  ["gap", gapCollapser],
  ["grid", gridCollapser],
  ["grid-area", gridAreaCollapser],
  ["grid-column", gridColumnCollapser],
  ["grid-row", gridRowCollapser],
  ["list-style", listStyleCollapser],
  ["outline", outlineCollapser],
  ["overflow", overflowCollapser],
  ["place-content", placeContentCollapser],
  ["place-items", placeItemsCollapser],
  ["place-self", placeSelfCollapser],
  ["text-decoration", textDecorationCollapser],
  ["text-emphasis", textEmphasisCollapser],
]);

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
