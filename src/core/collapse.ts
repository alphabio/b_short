// b_path:: src/core/collapse.ts

/**
 * Main collapse API for reconstructing shorthand properties from longhands.
 * @module collapse
 */
import { collapseRegistry } from "../internal/collapse-registry";
import { parseCssDeclaration, parseInputString, stripComments } from "../internal/parsers";
import type { BStyleWarning, CollapseOptions, CollapseResult } from "./schema";
import { DEFAULT_COLLAPSE_OPTIONS } from "./schema";

/**
 * Parse CSS string input into a properties object
 * @internal
 */
function parseCssToObject(css: string): Record<string, string> {
  const cleaned = stripComments(css);
  const declarations = parseInputString(cleaned);
  const properties: Record<string, string> = {};

  for (const decl of declarations) {
    const parsed = parseCssDeclaration(decl);
    if (parsed) {
      properties[parsed.property] = parsed.value;
    }
  }

  return properties;
}

/**
 * Format properties object back to CSS string
 * @internal
 */
function formatCssString(properties: Record<string, string>, indent = 0): string {
  const indentStr = "  ".repeat(indent);
  return Object.entries(properties)
    .map(([prop, value]) => `${indentStr}${prop}: ${value};`)
    .join("\n");
}

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
 * 5. If not, keep the longhand properties and report issues
 *
 * @param input - CSS properties as object or CSS string
 * @param options - Configuration options for collapse behavior
 * @returns Result object with collapsed properties/CSS, success status, and any issues
 *
 * @example
 * ```typescript
 * import { collapse } from 'b_short';
 *
 * // Object input - complete longhands
 * collapse({ 'overflow-x': 'hidden', 'overflow-y': 'hidden' });
 * // → { ok: true, result: { overflow: 'hidden' }, issues: [] }
 *
 * // Object input - incomplete longhands (with warning)
 * collapse({ 'overflow-x': 'hidden' });
 * // → {
 * //     ok: true,
 * //     result: { 'overflow-x': 'hidden' },
 * //     issues: [{ property: 'overflow', name: 'incomplete-longhands', ... }]
 * //   }
 *
 * // CSS string input with indentation
 * collapse(`
 *   overflow-x: hidden;
 *   overflow-y: auto;
 * `, { indent: 2 });
 * // → {
 * //     ok: true,
 * //     result: "    overflow: hidden auto;",
 * //     issues: []
 * //   }
 * ```
 */
export function collapse(
  input: Record<string, string> | string,
  options: Partial<CollapseOptions> = {}
): CollapseResult {
  const { indent = DEFAULT_COLLAPSE_OPTIONS.indent } = options;

  // Handle string input
  if (typeof input === "string") {
    const properties = parseCssToObject(input);
    const { properties: collapsed, issues } = collapseProperties(properties);
    return {
      ok: true,
      result: formatCssString(collapsed, indent),
      issues,
    };
  }

  // Handle object input
  const { properties: collapsed, issues } = collapseProperties(input);
  return {
    ok: true,
    result: collapsed,
    issues,
  };
}

/**
 * Internal function to collapse properties object with issue tracking
 * @internal
 */
function collapseProperties(properties: Record<string, string>): {
  properties: Record<string, string>;
  issues: BStyleWarning[];
} {
  const result: Record<string, string> = {};
  const processedLonghands = new Set<string>();
  const issues: BStyleWarning[] = [];

  // Get all available shorthands that have collapse handlers
  const availableShorthands = collapseRegistry.getAllShorthands();

  // Define shorthand priority - more specific shorthands should be processed first
  // This ensures grid-area takes precedence over grid-column/grid-row
  const shorthandPriority: Record<string, number> = {
    "grid-area": 100, // Highest priority (4 longhands)
    "grid-column": 50, // Medium priority (2 longhands)
    "grid-row": 50, // Medium priority (2 longhands)
  };

  // Sort shorthands by priority (higher first), then by number of longhands (more first)
  const sortedShorthands = availableShorthands.sort((a, b) => {
    const priorityA = shorthandPriority[a] || 0;
    const priorityB = shorthandPriority[b] || 0;
    if (priorityA !== priorityB) return priorityB - priorityA;

    // If priority is equal, prefer shorthands with more longhands
    const handlerA = collapseRegistry.get(a);
    const handlerB = collapseRegistry.get(b);
    const lengthA = handlerA?.meta.longhands.length || 0;
    const lengthB = handlerB?.meta.longhands.length || 0;
    return lengthB - lengthA;
  });

  // Try to collapse each shorthand
  for (const shorthand of sortedShorthands) {
    const collapseHandler = collapseRegistry.get(shorthand);
    if (!collapseHandler) continue;

    // Skip if any of the required longhands have already been processed
    const hasProcessedLonghand = collapseHandler.meta.longhands.some((longhand) =>
      processedLonghands.has(longhand)
    );
    if (hasProcessedLonghand) continue;

    // Check if we can collapse this shorthand
    const canCollapse = collapseHandler.canCollapse(properties);

    // If we can't collapse, check if there are some (but not all) longhands present
    if (!canCollapse) {
      const presentLonghands = collapseHandler.meta.longhands.filter(
        (longhand) => longhand in properties
      );

      // If some longhands are present but not all, report as issue
      if (
        presentLonghands.length > 0 &&
        presentLonghands.length < collapseHandler.meta.longhands.length
      ) {
        const missingLonghands = collapseHandler.meta.longhands.filter(
          (longhand) => !(longhand in properties)
        );

        issues.push({
          property: shorthand,
          name: "incomplete-longhands",
          formattedWarning: `Cannot collapse to '${shorthand}': missing ${missingLonghands.join(", ")}. Present: ${presentLonghands.join(", ")}.`,
        });
      }

      continue;
    }

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

  return { properties: result, issues };
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
