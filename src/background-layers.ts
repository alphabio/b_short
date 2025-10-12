// b_path:: src/background-layers.ts

import * as csstree from "css-tree";
import isColor from "./is-color";
import type { BackgroundLayer, BackgroundResult } from "./schema";

// CSS default values for background properties
export const BACKGROUND_DEFAULTS = {
  image: "none",
  position: "0% 0%",
  size: "auto auto",
  repeat: "repeat",
  attachment: "scroll",
  origin: "padding-box",
  clip: "border-box",
} as const;

/**
 * Detects if a background value needs advanced parsing (multi-layer backgrounds)
 */
export function needsAdvancedParser(value: string): boolean {
  // Only use advanced parsing for actual multi-layer backgrounds (comma-separated)
  // Must ignore commas inside parentheses/brackets (functions, rgba(), etc.)
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
      // Found a comma at the top level - this indicates multiple layers
      return true;
    }
  }

  return false;
}

/**
 * Splits a background value into layers, respecting nested functions
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
 * Parses a complex background value using css-tree AST parsing
 */
export function parseBackgroundLayers(value: string): BackgroundResult | undefined {
  try {
    // Split into layers
    const layerStrings = splitLayers(value);
    if (layerStrings.length === 0) {
      return undefined;
    }

    // Parse each layer to extract all properties
    const parsedLayers: Array<BackgroundLayer & { color?: string }> = [];
    let globalColor: string | undefined;

    for (const layerStr of layerStrings) {
      const parsedLayer = parseSingleLayer(layerStr);

      // Extract color from the last layer that has one
      if (parsedLayer.color) {
        globalColor = parsedLayer.color;
      }

      parsedLayers.push(parsedLayer);
    }

    // Now distribute properties across layers according to CSS rules
    const layers = distributeLayerProperties(parsedLayers);

    return {
      layers,
      color: globalColor,
    };
  } catch (_error) {
    // If parsing fails, return undefined to indicate invalid input
    return undefined;
  }
}

/**
 * Distributes properties across layers according to CSS background rules
 */
function distributeLayerProperties(
  parsedLayers: Array<BackgroundLayer & { color?: string }>
): BackgroundLayer[] {
  // For CSS backgrounds, properties are NOT distributed across layers.
  // Each layer only gets the properties that were explicitly specified for it.
  // Unspecified properties remain undefined and get default values during reconstruction.

  const result: BackgroundLayer[] = [];

  // Just copy the parsed properties - no distribution needed
  for (const layer of parsedLayers) {
    const { color: _, ...layerProps } = layer;
    result.push(layerProps);
  }

  // Special handling for origin/clip: if a layer specifies only one box value,
  // it applies to both origin and clip
  result.forEach((layer) => {
    if (layer.origin !== undefined && layer.clip === undefined) {
      layer.clip = layer.origin;
    }
  });

  return result;
}

/**
 * Parses a single background layer using css-tree AST parsing
 */
function parseSingleLayerWithCssTree(layerValue: string): BackgroundLayer & { color?: string } {
  const result: BackgroundLayer & { color?: string } = {};

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

  // Process children in order, handling position/size parsing
  processCssChildren(children, result);

  return result;
}

/**
 * Processes CSS AST children sequentially to extract background properties
 *
 * This function handles the complex parsing of CSS background layer syntax,
 * including position/size combinations separated by "/", various keyword types,
 * and proper ordering according to CSS specifications.
 */
function processCssChildren(
  children: csstree.CssNode[],
  result: BackgroundLayer & { color?: string }
): void {
  let i = 0;
  let hasPositionSize = false;

  while (i < children.length) {
    const child = children[i];

    // Skip whitespace and operators (except "/")
    if (child.type === "WhiteSpace") {
      i++;
      continue;
    }

    if (child.type === "Operator" && (child as csstree.Operator).value !== "/") {
      i++;
      continue;
    }

    // Handle background-image (url(), none, or image functions like gradients)
    if (child.type === "Url" && !result.image) {
      result.image = `url(${(child as csstree.Url).value})`;
      i++;
      continue;
    }

    if (child.type === "Function") {
      const funcNode = child as csstree.FunctionNode;
      if (
        [
          "linear-gradient",
          "radial-gradient",
          "conic-gradient",
          "repeating-linear-gradient",
          "repeating-radial-gradient",
          "repeating-conic-gradient",
          "image",
          "element",
        ].includes(funcNode.name)
      ) {
        if (!result.image) {
          result.image = csstree.generate(child);
        }
        i++;
        continue;
      }
    }

    if (
      child.type === "Identifier" &&
      (child as csstree.Identifier).name === "none" &&
      !result.image
    ) {
      result.image = "none";
      i++;
      continue;
    }

    // Handle position and size (complex parsing needed)
    if (
      !hasPositionSize &&
      ((child.type === "Operator" && (child as csstree.Operator).value === "/") ||
        (child.type === "Identifier" &&
          ["left", "center", "right", "top", "bottom"].includes(
            (child as csstree.Identifier).name
          )) ||
        child.type === "Dimension" ||
        child.type === "Percentage" ||
        child.type === "Number")
    ) {
      const positionParts: string[] = [];
      const sizeParts: string[] = [];
      let _hasSlash = false;

      // Check if we start with "/"
      if (child.type === "Operator" && (child as csstree.Operator).value === "/") {
        _hasSlash = true;
        i++; // skip "/"

        // Collect size parts
        while (i < children.length) {
          const currentChild = children[i];
          if (currentChild.type === "WhiteSpace") {
            i++;
            continue;
          }
          if (
            currentChild.type === "Dimension" ||
            currentChild.type === "Percentage" ||
            currentChild.type === "Number" ||
            (currentChild.type === "Identifier" &&
              ["auto", "cover", "contain"].includes((currentChild as csstree.Identifier).name))
          ) {
            sizeParts.push(csstree.generate(currentChild));
            i++;
          } else {
            break;
          }
        }
      } else {
        // Collect position parts until we hit "/" or a non-position node
        while (i < children.length) {
          const currentChild = children[i];
          if (currentChild.type === "WhiteSpace") {
            i++;
            continue;
          }

          if (
            currentChild.type === "Operator" &&
            (currentChild as csstree.Operator).value === "/"
          ) {
            _hasSlash = true;
            i++; // skip "/"

            // Collect size parts
            while (i < children.length) {
              const sizeChild = children[i];
              if (sizeChild.type === "WhiteSpace") {
                i++;
                continue;
              }
              if (
                sizeChild.type === "Dimension" ||
                sizeChild.type === "Percentage" ||
                sizeChild.type === "Number" ||
                (sizeChild.type === "Identifier" &&
                  ["auto", "cover", "contain"].includes((sizeChild as csstree.Identifier).name))
              ) {
                sizeParts.push(csstree.generate(sizeChild));
                i++;
              } else {
                break;
              }
            }
            break;
          } else if (
            (currentChild.type === "Identifier" &&
              ["left", "center", "right", "top", "bottom"].includes(
                (currentChild as csstree.Identifier).name
              )) ||
            currentChild.type === "Dimension" ||
            currentChild.type === "Percentage" ||
            currentChild.type === "Number"
          ) {
            positionParts.push(csstree.generate(currentChild));
            i++;
          } else {
            break;
          }
        }
      }

      if (positionParts.length > 0) {
        result.position = positionParts.join(" ");
      }
      if (sizeParts.length > 0) {
        result.size = sizeParts.join(" ");
      }

      hasPositionSize = true;
      continue;
    }

    // Handle repeat values
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (["repeat", "repeat-x", "repeat-y", "space", "round", "no-repeat"].includes(name)) {
        if (!result.repeat) {
          let repeat = name;
          i++;

          // Check for second repeat value
          if (i < children.length && children[i].type === "Identifier") {
            const nextName = (children[i] as csstree.Identifier).name;
            if (
              ["repeat", "repeat-x", "repeat-y", "space", "round", "no-repeat"].includes(nextName)
            ) {
              repeat += ` ${nextName}`;
              i++;
            }
          }

          result.repeat = repeat;
        } else {
          i++;
        }
        continue;
      }
    }

    // Handle attachment
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (["fixed", "local", "scroll"].includes(name)) {
        if (!result.attachment) {
          result.attachment = name;
        }
        i++;
        continue;
      }
    }

    // Handle box values (origin/clip)
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (["border-box", "padding-box", "content-box"].includes(name)) {
        if (!result.origin) {
          result.origin = name;
        } else if (!result.clip) {
          result.clip = name;
        }
        i++;
        continue;
      }
    }

    // Handle colors
    if (child.type === "Identifier" || child.type === "Function" || child.type === "Hash") {
      const value = csstree.generate(child);
      if (isColor(value)) {
        result.color = value;
        i++;
        continue;
      }
    }

    // Skip unrecognized nodes
    i++;
  }
}

/**
 * Parses a single background layer using css-tree AST parsing
 *
 * This function now uses css-tree for robust CSS parsing instead of
 * the previous custom tokenizer approach.
 */
function parseSingleLayer(layerValue: string): BackgroundLayer & { color?: string } {
  return parseSingleLayerWithCssTree(layerValue);
}

/**
 * Distributes property values across layers according to CSS rules
 */
export function distributeProperties(
  layers: BackgroundLayer[],
  properties: Record<string, string[]>
): BackgroundLayer[] {
  const result = layers.map((layer) => ({ ...layer }));

  // Apply property distribution for each property type
  Object.entries(properties).forEach(([property, values]) => {
    const distributedValues = distributeValues(values, layers.length);

    distributedValues.forEach((value, index) => {
      if (result[index]) {
        (result[index] as BackgroundLayer)[property as keyof BackgroundLayer] = value;
      }
    });
  });

  return result;
}

/**
 * Distributes values across layers using CSS repetition rules
 */
export function distributeValues(values: string[], layerCount: number): string[] {
  if (values.length === 0) return [];

  const result: string[] = [];

  for (let i = 0; i < layerCount; i++) {
    // CSS rule: repeat values cyclically if fewer than layers
    result.push(values[i % values.length]);
  }

  return result;
}

/**
 * Reconstructs final CSS properties from layer objects
 */
export function reconstructLayers(
  layers: BackgroundLayer[],
  color?: string
): Record<string, string> {
  const result: Record<string, string> = {};

  // Collect all layer values for each property
  const properties = {
    "background-image": layers.map((l) => l.image || BACKGROUND_DEFAULTS.image),
    "background-position": layers.map((l) => l.position || BACKGROUND_DEFAULTS.position),
    "background-size": layers.map((l) => l.size || BACKGROUND_DEFAULTS.size),
    "background-repeat": layers.map((l) => l.repeat || BACKGROUND_DEFAULTS.repeat),
    "background-attachment": layers.map((l) => l.attachment || BACKGROUND_DEFAULTS.attachment),
    "background-origin": layers.map((l) => l.origin || BACKGROUND_DEFAULTS.origin),
    "background-clip": layers.map((l) => l.clip || BACKGROUND_DEFAULTS.clip),
  };

  // Join layer values with commas
  Object.entries(properties).forEach(([property, values]) => {
    result[property] = values.join(", ");
  });

  // Add color if specified
  if (color) {
    result["background-color"] = color;
  }

  return result;
}
