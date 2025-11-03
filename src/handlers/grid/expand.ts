// b_path:: src/handlers/grid/expand.ts

// NOTE: This handler contains extremely complex grid template syntax parsing logic
// (~446 lines) that is a candidate for future refactoring. The implementation handles
// named grid lines, track sizes, repeat() notation, area names, and multiple syntaxes
// (template form, explicit-rows, explicit-columns). The parsing logic is preserved as-is.

import * as csstree from "css-tree";
import { createPropertyHandler, type PropertyHandler } from "@/internal/property-handler";

// CSS default values for grid properties
// NOTE: row-gap and column-gap are NOT part of grid shorthand
export const GRID_DEFAULTS = {
  "grid-template-rows": "none",
  "grid-template-columns": "none",
  "grid-template-areas": "none",
  "grid-auto-rows": "auto",
  "grid-auto-columns": "auto",
  "grid-auto-flow": "row",
} as const;

/**
 * Parses value and returns segments and slash count
 */
function parseValueAndGetSegments(
  value: string
): { leftSegment: csstree.CssNode[]; rightSegment: csstree.CssNode[]; slashCount: number } | null {
  try {
    const ast = csstree.parse(value.trim(), { context: "value" }) as csstree.Value;

    // Find top-level / operator positions
    const slashIndices: number[] = [];

    csstree.walk(ast, {
      visit: "Value",
      enter: (node: csstree.Value) => {
        if (node.children) {
          let index = 0;
          node.children.forEach((child) => {
            if (child.type === "Operator" && (child as csstree.Operator).value === "/") {
              slashIndices.push(index);
            }
            index++;
          });
        }
      },
    });

    const slashCount = slashIndices.length;
    if (slashCount > 1) {
      return null; // Multiple slashes not allowed
    }

    const childrenArray = listToArray(ast.children);
    if (slashCount === 0) {
      return { leftSegment: childrenArray, rightSegment: [], slashCount: 0 };
    }

    const slashIndex = slashIndices[0];
    const leftSegment = childrenArray.slice(0, slashIndex);
    const rightSegment = childrenArray.slice(slashIndex + 1);

    return { leftSegment, rightSegment, slashCount };
  } catch {
    return null;
  }
}

/**
 * Detects which grid shorthand form is being used
 */
function detectGridForm(
  leftSegment: csstree.CssNode[],
  rightSegment: csstree.CssNode[]
): "template" | "explicit-rows" | "explicit-columns" | null {
  if (rightSegment.length === 0) {
    // No slash, check if it's valid track list or ASCII art
    return "template";
  }

  // Check for auto-flow in each segment
  let hasAutoFlowLeft = false;
  let hasAutoFlowRight = false;

  for (const node of leftSegment) {
    if (node.type === "Identifier" && (node as csstree.Identifier).name === "auto-flow") {
      hasAutoFlowLeft = true;
      break;
    }
  }

  for (const node of rightSegment) {
    if (node.type === "Identifier" && (node as csstree.Identifier).name === "auto-flow") {
      hasAutoFlowRight = true;
      break;
    }
  }

  if (hasAutoFlowRight) {
    return "explicit-rows";
  } else if (hasAutoFlowLeft) {
    return "explicit-columns";
  } else {
    return "template";
  }
}

/**
 * Helper to convert List to array
 */
function listToArray<T>(list: csstree.List<T>): T[] {
  const arr: T[] = [];
  for (const item of list) {
    arr.push(item);
  }
  return arr;
}

/**
 * Separates areas (strings) and tracks (other nodes) from a segment
 */
function separateAreasAndTracks(segmentNodes: csstree.CssNode[]): {
  areas: string | undefined;
  tracks: string | undefined;
} {
  const strings: string[] = [];
  const tracks: csstree.CssNode[] = [];

  for (const node of segmentNodes) {
    if (node.type === "String") {
      strings.push((node as csstree.StringNode).value);
    } else if (node.type !== "WhiteSpace") {
      tracks.push(node);
    }
  }

  let areas: string | undefined;
  if (strings.length > 0) {
    // Validate that all rows have the same number of columns
    const rows = strings.map((s) => s.trim().split(/\s+/));
    const columnCount = rows[0]?.length || 0;
    if (columnCount === 0 || !rows.every((row) => row.length === columnCount)) {
      return { areas: undefined, tracks: undefined }; // Invalid
    }
    areas = strings.map((s) => `"${s.trim()}"`).join(" ");
  }

  let tracksStr: string | undefined;
  if (tracks.length > 0) {
    tracksStr = parseTrackList(tracks);
  }

  return { areas, tracks: tracksStr };
}

/**
 * Parses track list (rows or columns) into CSS string
 */
function parseTrackList(segmentNodes: csstree.CssNode[]): string | undefined {
  const validNodes: csstree.CssNode[] = [];

  for (const node of segmentNodes) {
    if (
      node.type === "Identifier" &&
      ["auto", "min-content", "max-content"].includes((node as csstree.Identifier).name)
    ) {
      validNodes.push(node);
    } else if (node.type === "Dimension") {
      validNodes.push(node);
    } else if (node.type === "Percentage") {
      validNodes.push(node);
    } else if (
      node.type === "Function" &&
      ["repeat", "minmax", "fit-content"].includes((node as csstree.FunctionNode).name)
    ) {
      validNodes.push(node);
    } else if (node.type === "Number" && (node as csstree.NumberNode).value === "0") {
      validNodes.push(node);
    } else if (node.type === "Parentheses") {
      // Named grid lines like [line1]
      validNodes.push(node);
    }
  }

  if (validNodes.length === 0) {
    return undefined;
  }

  // Generate CSS from the valid nodes
  const generatedParts: string[] = [];
  for (const node of validNodes) {
    generatedParts.push(csstree.generate(node));
  }

  return generatedParts.join(" ");
}

/**
 * Parses template form: <grid-template>
 */
function parseTemplateForm(
  leftSegment: csstree.CssNode[],
  rightSegment: csstree.CssNode[]
): Record<string, string> | undefined {
  let templateAreas: string | undefined;
  let templateRows: string | undefined;
  let templateColumns: string | undefined;

  if (rightSegment.length === 0) {
    // No slash - could be just rows, but not areas
    const { areas, tracks } = separateAreasAndTracks(leftSegment);
    if (areas) {
      return undefined; // Strings without slash not supported
    }
    templateRows = tracks;
    if (!templateRows) {
      return undefined; // Invalid
    }
  } else {
    const { areas: leftAreas, tracks: leftTracks } = separateAreasAndTracks(leftSegment);
    const { tracks: rightTracks } = separateAreasAndTracks(rightSegment);

    // Template form logic:
    // - If left has areas, then left areas + left tracks (as rows) + right columns
    // - If left has tracks but no areas, then left rows + right columns
    // - If no slash and left has areas, then just areas
    // - If no slash and left has tracks, then just rows

    if (leftAreas) {
      templateAreas = leftAreas;
      templateRows = leftTracks; // Interleaved track sizes become rows
      templateColumns = rightTracks;
      if (!templateColumns) {
        return undefined;
      }
    } else if (leftTracks) {
      templateRows = leftTracks;
      templateColumns = rightTracks;
      if (!templateColumns) {
        return undefined;
      }
    } else {
      return undefined; // Invalid
    }
  }

  return {
    "grid-template-rows": templateRows || GRID_DEFAULTS["grid-template-rows"],
    "grid-template-columns": templateColumns || GRID_DEFAULTS["grid-template-columns"],
    "grid-template-areas": templateAreas || GRID_DEFAULTS["grid-template-areas"],
    "grid-auto-rows": GRID_DEFAULTS["grid-auto-rows"],
    "grid-auto-columns": GRID_DEFAULTS["grid-auto-columns"],
    "grid-auto-flow": GRID_DEFAULTS["grid-auto-flow"],
  };
}

/**
 * Parses explicit rows form: <rows> / auto-flow [dense] [<auto-columns>]
 */
function parseExplicitRowsForm(
  leftSegment: csstree.CssNode[],
  rightSegment: csstree.CssNode[]
): Record<string, string> | undefined {
  // Check if right segment starts with auto-flow
  let firstNonWhiteSpace: csstree.CssNode | undefined;
  for (const node of rightSegment) {
    if (node.type !== "WhiteSpace") {
      firstNonWhiteSpace = node;
      break;
    }
  }
  if (
    !firstNonWhiteSpace ||
    firstNonWhiteSpace.type !== "Identifier" ||
    (firstNonWhiteSpace as csstree.Identifier).name !== "auto-flow"
  ) {
    return undefined;
  }

  // Left side: template rows
  const templateRows = parseTrackList(leftSegment);
  if (!templateRows) {
    return undefined;
  }

  // Right side: auto-flow [dense] [auto-columns]
  let autoFlow = "column";
  let autoColumns: string | undefined;

  // Find auto-flow and dense
  let hasDense = false;
  let autoColumnsStart = -1;

  for (let i = 0; i < rightSegment.length; i++) {
    const node = rightSegment[i];
    if (node.type === "Identifier" && (node as csstree.Identifier).name === "auto-flow") {
      // Next might be dense
      if (
        i + 1 < rightSegment.length &&
        rightSegment[i + 1].type === "Identifier" &&
        (rightSegment[i + 1] as csstree.Identifier).name === "dense"
      ) {
        hasDense = true;
        autoColumnsStart = i + 2;
      } else {
        autoColumnsStart = i + 1;
      }
      break;
    }
  }

  if (hasDense) {
    autoFlow = "column dense";
  }

  // Parse auto-columns if present
  if (autoColumnsStart >= 0 && autoColumnsStart < rightSegment.length) {
    const autoColumnsSegment = rightSegment.slice(autoColumnsStart);
    autoColumns = parseTrackList(autoColumnsSegment);
  }

  return {
    "grid-template-rows": templateRows,
    "grid-template-columns": GRID_DEFAULTS["grid-template-columns"],
    "grid-template-areas": GRID_DEFAULTS["grid-template-areas"],
    "grid-auto-rows": GRID_DEFAULTS["grid-auto-rows"],
    "grid-auto-columns": autoColumns || GRID_DEFAULTS["grid-auto-columns"],
    "grid-auto-flow": autoFlow,
  };
}

/**
 * Parses explicit columns form: auto-flow [dense] [<auto-rows>] / <columns>
 */
function parseExplicitColumnsForm(
  leftSegment: csstree.CssNode[],
  rightSegment: csstree.CssNode[]
): Record<string, string> | undefined {
  // Check if left segment starts with auto-flow
  let firstNonWhiteSpace: csstree.CssNode | undefined;
  for (const node of leftSegment) {
    if (node.type !== "WhiteSpace") {
      firstNonWhiteSpace = node;
      break;
    }
  }
  if (
    !firstNonWhiteSpace ||
    firstNonWhiteSpace.type !== "Identifier" ||
    (firstNonWhiteSpace as csstree.Identifier).name !== "auto-flow"
  ) {
    return undefined;
  }

  // Right side: template columns
  const templateColumns = parseTrackList(rightSegment);
  if (!templateColumns) {
    return undefined;
  }

  // Left side: auto-flow [dense] [auto-rows]
  let autoFlow = "row";
  let autoRows: string | undefined;

  // Find auto-flow and dense
  let hasDense = false;
  let autoRowsStart = -1;

  for (let i = 0; i < leftSegment.length; i++) {
    const node = leftSegment[i];
    if (node.type === "Identifier" && (node as csstree.Identifier).name === "auto-flow") {
      // Next might be dense
      if (
        i + 1 < leftSegment.length &&
        leftSegment[i + 1].type === "Identifier" &&
        (leftSegment[i + 1] as csstree.Identifier).name === "dense"
      ) {
        hasDense = true;
        autoRowsStart = i + 2;
      } else {
        autoRowsStart = i + 1;
      }
      break;
    }
  }

  if (hasDense) {
    autoFlow = "row dense";
  }

  // Parse auto-rows if present
  if (autoRowsStart >= 0 && autoRowsStart < leftSegment.length) {
    const autoRowsSegment = leftSegment.slice(autoRowsStart);
    autoRows = parseTrackList(autoRowsSegment);
  }

  return {
    "grid-template-rows": GRID_DEFAULTS["grid-template-rows"],
    "grid-template-columns": templateColumns,
    "grid-template-areas": GRID_DEFAULTS["grid-template-areas"],
    "grid-auto-rows": autoRows || GRID_DEFAULTS["grid-auto-rows"],
    "grid-auto-columns": GRID_DEFAULTS["grid-auto-columns"],
    "grid-auto-flow": autoFlow,
  };
}

function parseGridValue(value: string): Record<string, string> | undefined {
  // Handle global CSS keywords
  if (/^(inherit|initial|unset|revert)$/i.test(value)) {
    return {
      "grid-template-rows": value,
      "grid-template-columns": value,
      "grid-template-areas": value,
      "grid-auto-rows": value,
      "grid-auto-columns": value,
      "grid-auto-flow": value,
    };
  }

  // Handle none keyword
  if (value.trim().toLowerCase() === "none") {
    return { ...GRID_DEFAULTS };
  }

  // Parse value and get segments
  const segments = parseValueAndGetSegments(value);
  if (!segments) {
    return undefined; // Invalid (e.g., multiple slashes)
  }

  // Detect form and parse accordingly
  const form = detectGridForm(segments.leftSegment, segments.rightSegment);
  switch (form) {
    case "template":
      return parseTemplateForm(segments.leftSegment, segments.rightSegment);
    case "explicit-rows":
      return parseExplicitRowsForm(segments.leftSegment, segments.rightSegment);
    case "explicit-columns":
      return parseExplicitColumnsForm(segments.leftSegment, segments.rightSegment);
    default:
      return undefined;
  }
}

export const gridHandler: PropertyHandler = createPropertyHandler({
  meta: {
    shorthand: "grid",
    longhands: [
      "grid-template-rows",
      "grid-template-columns",
      "grid-template-areas",
      "grid-auto-rows",
      "grid-auto-columns",
      "grid-auto-flow",
      // NOTE: row-gap and column-gap are NOT part of grid shorthand
      // They have their own 'gap' shorthand
    ],
    defaults: GRID_DEFAULTS,
    category: "layout",
  },

  expand: (value: string) => parseGridValue(value),

  validate: (value: string) => gridHandler.expand(value) !== undefined,
});

export default (value: string): Record<string, string> | undefined => {
  return gridHandler.expand(value);
};
