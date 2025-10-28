// b_path:: src/animation-layers.ts

import * as csstree from "css-tree";
import type { AnimationLayer, AnimationResult } from "./core/schema";
import isTime from "./internal/is-time";
import isTimingFunction from "./internal/is-timing-function";
import { hasTopLevelCommas, parseLayersGeneric } from "./internal/layer-parser-utils";

// CSS default values for animation properties
export const ANIMATION_DEFAULTS = {
  name: "none",
  duration: "0s",
  timingFunction: "ease",
  delay: "0s",
  iterationCount: "1",
  direction: "normal",
  fillMode: "none",
  playState: "running",
} as const;

/**
 * Detects if an animation value needs advanced parsing (multi-layer animations or complex functions)
 */
export function needsAdvancedParser(value: string): boolean {
  return hasTopLevelCommas(value, true);
}

/**
 * Parses a complex animation value using css-tree AST parsing
 */
export function parseAnimationLayers(value: string): AnimationResult | undefined {
  const layers = parseLayersGeneric(value, parseSingleLayer);
  return layers ? { layers } : undefined;
}

/**
 * Parses a single animation layer using css-tree AST parsing
 */
function parseSingleLayer(layerValue: string): AnimationLayer | undefined {
  const result: AnimationLayer = {};

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

  // Process children in order, handling animation property parsing
  if (!processCssChildren(children, result)) {
    return undefined; // Parsing failed due to invalid syntax
  }

  return result;
}

/**
 * Processes CSS AST children sequentially to extract animation properties
 *
 * This function handles the parsing of CSS animation layer syntax,
 * including animation names, time values, timing functions, iteration counts,
 * direction, fill mode, and play state.
 * CSS ordering rules: first time = duration, second time = delay
 *
 * Returns false if parsing should fail (e.g., too many time values, unrecognized tokens, duplicates)
 */
function processCssChildren(children: csstree.CssNode[], result: AnimationLayer): boolean {
  let timeCount = 0; // Track first vs second time value

  for (const child of children) {
    let matched = false; // Track if this token was recognized

    // Skip whitespace and operators
    if (child.type === "WhiteSpace" || child.type === "Operator") {
      continue;
    }

    // Handle animation name first (can be any identifier including var() or quoted strings)
    if (!result.name) {
      if (child.type === "Identifier") {
        const name = (child as csstree.Identifier).name;
        if (name === "none") {
          result.name = "none";
          matched = true;
        }
        // Check if it looks like a valid animation name identifier
        // Allow custom identifiers matching pattern, but exclude timing functions and other keywords
        else if (
          /^-?[a-zA-Z][a-zA-Z0-9-]*$/.test(name) &&
          !isTimingFunction(name) &&
          !/^(normal|reverse|alternate|alternate-reverse|none|forwards|backwards|both|running|paused|infinite)$/i.test(
            name
          )
        ) {
          result.name = name;
          matched = true;
        }
      } else if (child.type === "Function") {
        const funcValue = csstree.generate(child);
        if (funcValue.startsWith("var(")) {
          result.name = funcValue;
          matched = true;
        }
      } else if (child.type === "String") {
        result.name = csstree.generate(child);
        matched = true;
      }

      if (matched) continue;
    }

    // Handle time values (duration and delay)
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
        matched = true;
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
        matched = true;
      }
    }

    // Handle timing functions (keywords and functions)
    if (!result.timingFunction) {
      if (child.type === "Identifier") {
        const timingValue = csstree.generate(child);
        if (isTimingFunction(timingValue)) {
          result.timingFunction = timingValue;
          matched = true;
        }
      }

      if (child.type === "Function") {
        const funcValue = csstree.generate(child);
        if (isTimingFunction(funcValue)) {
          // Fix spacing in function calls (css-tree removes spaces after commas)
          result.timingFunction = funcValue.replace(/,([^\s])/g, ", $1");
          matched = true;
        }
      }
    } else {
      // Check for duplicates
      if (child.type === "Identifier") {
        const timingValue = csstree.generate(child);
        if (isTimingFunction(timingValue)) {
          return false; // Duplicate timing function
        }
      }
      if (child.type === "Function") {
        const funcValue = csstree.generate(child);
        if (isTimingFunction(funcValue)) {
          return false; // Duplicate timing function
        }
      }
    }

    // Handle iteration count
    if (!result.iterationCount) {
      if (child.type === "Number") {
        const numValue = csstree.generate(child);
        result.iterationCount = numValue;
        matched = true;
      }
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (identValue === "infinite") {
          result.iterationCount = "infinite";
          matched = true;
        }
      }
    } else {
      // Check for duplicates
      if (child.type === "Number") {
        return false; // Duplicate iteration count
      }
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (identValue === "infinite") {
          return false; // Duplicate iteration count
        }
      }
    }

    // Handle direction keywords
    if (!result.direction) {
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (/^(normal|reverse|alternate|alternate-reverse)$/i.test(identValue)) {
          result.direction = identValue;
          matched = true;
        }
      }
    } else {
      // Check for duplicates
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (/^(normal|reverse|alternate|alternate-reverse)$/i.test(identValue)) {
          return false; // Duplicate direction
        }
      }
    }

    // Handle fill mode keywords
    if (!result.fillMode) {
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (/^(none|forwards|backwards|both)$/i.test(identValue)) {
          result.fillMode = identValue;
          matched = true;
        }
      }
    } else {
      // Check for duplicates
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (/^(none|forwards|backwards|both)$/i.test(identValue)) {
          return false; // Duplicate fill mode
        }
      }
    }

    // Handle play state keywords
    if (!result.playState) {
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (/^(running|paused)$/i.test(identValue)) {
          result.playState = identValue;
          matched = true;
        }
      }
    } else {
      // Check for duplicates
      if (child.type === "Identifier") {
        const identValue = csstree.generate(child);
        if (/^(running|paused)$/i.test(identValue)) {
          return false; // Duplicate play state
        }
      }
    }

    // If token was not matched by any category, it's unrecognized
    if (!matched) {
      return false;
    }
  }

  return true;
}

/**
 * Reconstructs final CSS properties from layer objects
 */
export function reconstructLayers(layers: AnimationLayer[]): Record<string, string> {
  const result: Record<string, string> = {};

  // Collect all layer values for each property
  const properties = {
    "animation-name": layers.map((l) => l.name || ANIMATION_DEFAULTS.name),
    "animation-duration": layers.map((l) => l.duration || ANIMATION_DEFAULTS.duration),
    "animation-timing-function": layers.map(
      (l) => l.timingFunction || ANIMATION_DEFAULTS.timingFunction
    ),
    "animation-delay": layers.map((l) => l.delay || ANIMATION_DEFAULTS.delay),
    "animation-iteration-count": layers.map(
      (l) => l.iterationCount || ANIMATION_DEFAULTS.iterationCount
    ),
    "animation-direction": layers.map((l) => l.direction || ANIMATION_DEFAULTS.direction),
    "animation-fill-mode": layers.map((l) => l.fillMode || ANIMATION_DEFAULTS.fillMode),
    "animation-play-state": layers.map((l) => l.playState || ANIMATION_DEFAULTS.playState),
  };

  // Join layer values with commas
  Object.entries(properties).forEach(([property, values]) => {
    result[property] = values.join(", ");
  });

  return result;
}
