// b_path:: src/transition-layers.ts

import * as csstree from "css-tree";
import isTime from "./is-time";
import isTimingFunction from "./is-timing-function";
import type { TransitionLayer, TransitionResult } from "./schema";

// CSS default values for transition properties
export const TRANSITION_DEFAULTS = {
  property: "all",
  duration: "0s",
  timingFunction: "ease",
  delay: "0s",
} as const;

/**
 * Detects if a transition value needs advanced parsing (multi-layer transitions or complex functions)
 */
export function needsAdvancedParser(value: string): boolean {
  // Use advanced parsing for:
  // 1. Multi-layer transitions (comma-separated)
  // 2. Complex timing functions with parentheses
  // Must ignore commas inside parentheses/brackets (functions, rgba(), etc.)
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

  // Use advanced parsing for complex timing functions
  return hasFunctions;
}

/**
 * Splits a transition value into layers, respecting nested functions
 */
function splitLayers(value: string): string[] {
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
 * Parses a complex transition value using css-tree AST parsing
 */
export function parseTransitionLayers(value: string): TransitionResult | undefined {
  try {
    // Split into layers
    const layerStrings = splitLayers(value);
    if (layerStrings.length === 0) {
      return undefined;
    }

    // Parse each layer to extract all properties
    const layers: TransitionLayer[] = [];

    for (const layerStr of layerStrings) {
      const parsedLayer = parseSingleLayer(layerStr);
      if (!parsedLayer) {
        return undefined; // Parsing failed for this layer
      }
      layers.push(parsedLayer);
    }

    return {
      layers,
    };
  } catch (_error) {
    // If parsing fails, return undefined to indicate invalid input
    return undefined;
  }
}

/**
 * Parses a single transition layer using css-tree AST parsing
 */
function parseSingleLayer(layerValue: string): TransitionLayer | undefined {
  const result: TransitionLayer = {};

  const ast = csstree.parse(layerValue.trim(), { context: "value" });

  // Collect all child nodes from the Value node
  const children: csstree.CssNode[] = [];
  csstree.walk(ast, {
    visit: "Value",
    enter: (node: csstree.Value) => {
      if (node.children) {
        node.children.forEach((child) => {
          children.push(child);
        });
      }
    },
  });

  // Process children in order, handling transition property parsing
  if (!processCssChildren(children, result)) {
    return undefined; // Parsing failed due to invalid syntax
  }

  return result;
}

/**
 * Processes CSS AST children sequentially to extract transition properties
 *
 * This function handles the parsing of CSS transition layer syntax,
 * including property names, time values, and timing functions.
 * CSS ordering rules: first time = duration, second time = delay
 *
 * Returns false if parsing should fail (e.g., too many time values)
 */
function processCssChildren(children: csstree.CssNode[], result: TransitionLayer): boolean {
  let timeCount = 0; // Track first vs second time value

  for (const child of children) {
    // Skip whitespace and operators
    if (child.type === "WhiteSpace" || child.type === "Operator") {
      continue;
    }

    // Handle time values first (duration and delay)
    if (child.type === "Dimension") {
      const timeValue = csstree.generate(child);
      if (isTime(timeValue)) {
        if (timeCount >= 2) {
          // More than 2 time values is invalid
          return false;
        }
        if (timeCount === 0) {
          result.duration = timeValue;
        } else {
          result.delay = timeValue;
        }
        timeCount++;
        continue;
      }
    }

    // Handle var() functions as time values
    if (child.type === "Function") {
      const funcValue = csstree.generate(child);
      if (funcValue.startsWith("var(")) {
        if (timeCount >= 2) {
          // More than 2 time values is invalid
          return false;
        }
        if (timeCount === 0) {
          result.duration = funcValue;
        } else {
          result.delay = funcValue;
        }
        timeCount++;
        continue;
      }
    }

    // Handle timing functions (keywords and functions)
    if (!result.timingFunction) {
      if (child.type === "Identifier") {
        const timingValue = csstree.generate(child);
        if (isTimingFunction(timingValue)) {
          result.timingFunction = timingValue;
          continue;
        }
      }

      if (child.type === "Function") {
        const funcValue = csstree.generate(child);
        if (isTimingFunction(funcValue)) {
          // Fix spacing in function calls (css-tree removes spaces after commas)
          result.timingFunction = funcValue.replace(/,([^\s])/g, ", $1");
          continue;
        }
      }
    }

    // Handle transition-property (none, all, or CSS property names)
    if (child.type === "Identifier" && !result.property) {
      const name = (child as csstree.Identifier).name;
      if (name === "none" || name === "all") {
        result.property = name;
        continue;
      }
      // Check if it looks like a CSS property name (not a timing function)
      // Allow vendor-prefixed properties starting with hyphen
      if (/^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(name) && !isTimingFunction(name)) {
        result.property = name;
      }
    }
  }

  return true;
}

/**
 * Reconstructs final CSS properties from layer objects
 */
export function reconstructLayers(layers: TransitionLayer[]): Record<string, string> {
  const result: Record<string, string> = {};

  // Collect all layer values for each property
  const properties = {
    "transition-property": layers.map((l) => l.property || TRANSITION_DEFAULTS.property),
    "transition-duration": layers.map((l) => l.duration || TRANSITION_DEFAULTS.duration),
    "transition-timing-function": layers.map(
      (l) => l.timingFunction || TRANSITION_DEFAULTS.timingFunction
    ),
    "transition-delay": layers.map((l) => l.delay || TRANSITION_DEFAULTS.delay),
  };

  // Join layer values with commas
  Object.entries(properties).forEach(([property, values]) => {
    result[property] = values.join(", ");
  });

  return result;
}
