// b_path:: src/layer-parser-utils.ts

/**
 * Shared utilities for parsing multi-layer CSS properties (background, mask, animation, transition).
 * Eliminates ~360 lines of duplication across layer-parsing modules.
 */

/**
 * Detects if a CSS value contains top-level commas (indicating multiple layers).
 * Ignores commas inside parentheses/brackets (functions, rgba(), etc.).
 *
 * @param value - CSS value to analyze
 * @param detectFunctions - If true, also return true for values with function calls
 * @returns true if multi-layer parsing is needed
 *
 * @example
 * hasTopLevelCommas('url(a.png), url(b.png)') // → true (multiple layers)
 * hasTopLevelCommas('rgba(0,0,0,0.5)')        // → false (comma inside function)
 * hasTopLevelCommas('cubic-bezier(0,0,1,1)', true) // → true (has function)
 */
export function hasTopLevelCommas(value: string, detectFunctions = false): boolean {
  let parenDepth = 0;
  let bracketDepth = 0;
  let hasFunctions = false;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      parenDepth++;
      hasFunctions = true;
    } else if (char === ")") {
      parenDepth--;
    } else if (char === "[") {
      bracketDepth++;
    } else if (char === "]") {
      bracketDepth--;
    } else if (char === "," && parenDepth === 0 && bracketDepth === 0) {
      // Found a comma at the top level - this indicates multiple layers
      return true;
    }
  }

  // Optionally detect functions (for animation/transition timing functions)
  return detectFunctions && hasFunctions;
}

/**
 * Splits a CSS value into layers at top-level commas, respecting nested functions.
 *
 * @param value - CSS value to split
 * @returns Array of layer strings (trimmed)
 *
 * @example
 * splitLayers('url(a.png) center, url(b.png) top')
 * // → ['url(a.png) center', 'url(b.png) top']
 *
 * splitLayers('rgba(0,0,0,0.5)')
 * // → ['rgba(0,0,0,0.5)']
 */
export function splitLayers(value: string): string[] {
  const layers: string[] = [];
  let currentLayer = "";
  let parenDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      parenDepth++;
    } else if (char === ")") {
      parenDepth--;
    } else if (char === "[") {
      bracketDepth++;
    } else if (char === "]") {
      bracketDepth--;
    } else if (char === "," && parenDepth === 0 && bracketDepth === 0) {
      // Found a comma at the top level - this separates layers
      layers.push(currentLayer.trim());
      currentLayer = "";
      continue;
    }

    currentLayer += char;
  }

  // Add the last layer
  if (currentLayer.trim()) {
    layers.push(currentLayer.trim());
  }

  return layers;
}

/**
 * Generic layer parsing factory for multi-layer CSS properties.
 * Handles splitting, parsing, and error handling uniformly.
 *
 * @param value - CSS value to parse
 * @param parseSingleLayer - Function to parse a single layer string
 * @returns Parsed layers or undefined on error
 *
 * @example
 * // Background parsing
 * parseLayersGeneric(
 *   'url(a.png) center, url(b.png) top',
 *   parseBackgroundLayer
 * )
 */
export function parseLayersGeneric<T>(
  value: string,
  parseSingleLayer: (layerValue: string) => T | undefined
): T[] | undefined {
  try {
    // Split into layers
    const layerStrings = splitLayers(value);
    if (layerStrings.length === 0) {
      return undefined;
    }

    // Parse each layer
    const layers: T[] = [];
    for (const layerStr of layerStrings) {
      const parsedLayer = parseSingleLayer(layerStr);
      if (!parsedLayer) {
        return undefined; // Parsing failed for this layer
      }
      layers.push(parsedLayer);
    }

    return layers;
  } catch (_error) {
    // If parsing fails, return undefined to indicate invalid input
    return undefined;
  }
}

/**
 * Collects all child nodes from a css-tree AST Value node.
 * Common pattern across all multi-layer parsers.
 *
 * @param ast - css-tree AST (must contain Value nodes)
 * @returns Flattened array of child nodes
 */
export function collectCssTreeChildren(ast: unknown): unknown[] {
  const children: unknown[] = [];

  // Type guard to ensure we have a valid css-tree node
  if (!ast || typeof ast !== "object") {
    return children;
  }

  // Walk the AST and collect children from Value nodes
  const csstree = require("css-tree");
  csstree.walk(ast, {
    visit: "Value",
    enter: (node: { children?: Iterable<unknown> }) => {
      if (node.children) {
        for (const child of node.children) {
          children.push(child);
        }
      }
    },
  });

  return children;
}
