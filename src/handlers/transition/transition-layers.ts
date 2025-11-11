// b_path:: src/handlers/transition/transition-layers.ts

import * as csstree from "@eslint/css-tree";
import type { TransitionLayer, TransitionResult } from "@/core/schema";
import isTime from "@/internal/is-time";
import isTimingFunction from "@/internal/is-timing-function";
import { matchesType } from "@/internal/is-value-node";
import { hasTopLevelCommas, parseLayersGeneric } from "@/internal/layer-parser-utils";

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
  return hasTopLevelCommas(value, true);
}

/**
 * Parses a complex transition value using css-tree AST parsing
 */
export function parseTransitionLayers(value: string): TransitionResult | undefined {
  const layers = parseLayersGeneric(value, parseSingleLayer);
  return layers ? { layers } : undefined;
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
    enter: (node: csstree.CssNode) => {
      if (node.type === "Value" && node.children) {
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

    // Handle timing functions FIRST (keywords and functions)
    // Must check before time values to avoid cubic-bezier() being treated as time
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

    // Handle time values (duration and delay)
    // Accept: Dimensions with time units (1s, 500ms), or any Function (calc, var, etc.)
    if (matchesType(child, ["Dimension", "Function"])) {
      const timeValue = csstree.generate(child);

      // For Dimensions, validate they have time units
      // For Functions (var, calc), accept unconditionally (carry over as-is)
      if (child.type === "Function" || isTime(timeValue)) {
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
