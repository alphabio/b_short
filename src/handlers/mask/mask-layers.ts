// b_path:: src/handlers/mask/mask-layers.ts

import * as csstree from "@eslint/css-tree";
import type { MaskLayer, MaskResult } from "@/core/schema";
import { isPositionValueNode, isSizeValueNode } from "@/internal/is-value-node";
import { hasTopLevelCommas, parseLayersGeneric } from "@/internal/layer-parser-utils";

// CSS default values for mask properties
export const MASK_DEFAULTS = {
  image: "none",
  mode: "match-source",
  position: "0% 0%",
  size: "auto",
  repeat: "repeat",
  origin: "border-box",
  clip: "border-box",
  composite: "add",
} as const;

/**
 * Detects if a mask value needs advanced parsing (multi-layer masks)
 */
export function needsAdvancedParser(value: string): boolean {
  return hasTopLevelCommas(value);
}

/**
 * Parses a complex mask value using css-tree AST parsing
 */
export function parseMaskLayers(value: string): MaskResult | undefined {
  const layers = parseLayersGeneric(value, parseSingleLayer);
  return layers ? { layers } : undefined;
}

/**
 * Parses a single mask layer using css-tree AST parsing
 */
function parseSingleLayer(layerValue: string): MaskLayer | undefined {
  return parseSingleLayerWithCssTree(layerValue);
}

/**
 * Parses a single mask layer using css-tree AST parsing
 */
function parseSingleLayerWithCssTree(layerValue: string): MaskLayer | undefined {
  const result: MaskLayer = {};

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

  // Process children in order, handling position/size parsing
  const isValid = processCssChildren(children, result);

  // Return undefined if there were unrecognized tokens (stricter error handling)
  return isValid ? result : undefined;
}

/**
 * Processes CSS AST children sequentially to extract mask properties
 *
 * This function handles the complex parsing of CSS mask layer syntax,
 * including position/size combinations separated by "/", various keyword types,
 * and proper ordering according to CSS specifications.
 */
function processCssChildren(children: csstree.CssNode[], result: MaskLayer): boolean {
  let i = 0;
  let hasPositionSize = false;
  let hasUnrecognizedToken = false;

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

    // Handle mask-image (url(), none, or image functions like gradients)
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
          "image-set",
          "cross-fade",
          "paint",
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
        isPositionValueNode(child, ["left", "center", "right", "top", "bottom"]))
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
          if (isSizeValueNode(currentChild, ["auto", "cover", "contain"])) {
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
              if (isSizeValueNode(sizeChild, ["auto", "cover", "contain"])) {
                sizeParts.push(csstree.generate(sizeChild));
                i++;
              } else {
                break;
              }
            }
            break;
          } else if (
            isPositionValueNode(currentChild, ["left", "center", "right", "top", "bottom"])
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
    // Note: repeat-x and repeat-y are supported for compatibility with background-repeat,
    // even though the mask-repeat spec technically only allows [repeat|no-repeat|round|space]{1,2}
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

    // Handle mode keywords
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (["alpha", "luminance", "match-source"].includes(name)) {
        if (!result.mode) {
          result.mode = name;
        }
        i++;
        continue;
      }
    }

    // Handle composite keywords
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (["add", "subtract", "intersect", "exclude"].includes(name)) {
        if (!result.composite) {
          result.composite = name;
        }
        i++;
        continue;
      }
    }

    // Handle geometry-box values (origin/clip)
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (
        ["border-box", "padding-box", "content-box", "fill-box", "stroke-box", "view-box"].includes(
          name
        )
      ) {
        if (!result.origin) {
          result.origin = name;
        } else if (!result.clip) {
          result.clip = name;
        }
        i++;
        continue;
      }
    }

    // Handle "no-clip" keyword for mask-clip
    if (child.type === "Identifier") {
      const name = (child as csstree.Identifier).name;
      if (name === "no-clip") {
        if (!result.clip) {
          result.clip = "no-clip";
        }
        i++;
        continue;
      }
    }

    // Skip unrecognized nodes - mark as having unrecognized token for stricter error handling
    hasUnrecognizedToken = true;
    i++;
  }

  // Special handling for origin/clip: if a layer specifies only one box value,
  // it applies to both origin and clip (CSS Masking spec behavior)
  if (result.origin !== undefined && result.clip === undefined) {
    result.clip = MASK_DEFAULTS.clip; // Default to border-box, not origin value
  }

  return !hasUnrecognizedToken;
}

/**
 * Reconstructs final CSS properties from layer objects
 */
export function reconstructLayers(layers: MaskLayer[]): Record<string, string> {
  const result: Record<string, string> = {};

  // Collect all layer values for each property
  const properties = {
    "mask-image": layers.map((l) => l.image || MASK_DEFAULTS.image),
    "mask-mode": layers.map((l) => l.mode || MASK_DEFAULTS.mode),
    "mask-position": layers.map((l) => l.position || MASK_DEFAULTS.position),
    "mask-size": layers.map((l) => l.size || MASK_DEFAULTS.size),
    "mask-repeat": layers.map((l) => l.repeat || MASK_DEFAULTS.repeat),
    "mask-origin": layers.map((l) => l.origin || MASK_DEFAULTS.origin),
    "mask-clip": layers.map((l) => l.clip || MASK_DEFAULTS.clip),
    "mask-composite": layers.map((l) => l.composite || MASK_DEFAULTS.composite),
  };

  // Join layer values with commas
  Object.entries(properties).forEach(([property, values]) => {
    result[property] = values.join(", ");
  });

  return result;
}
