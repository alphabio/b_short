// b_path:: src/handlers/grid/collapse.ts

import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";
import {
  allDefaults,
  canCollapseToAutoFlowColumns,
  canCollapseToAutoFlowRows,
  canCollapseToTemplate,
  isDefault,
} from "./collapse-utils";

/**
 * Collapse handler for the grid shorthand property.
 *
 * Reconstructs `grid` from 8 longhand properties.
 *
 * Supported forms:
 * 1. `none` - All properties at defaults
 * 2. `<template-rows> / <template-columns>` - Simple template
 * 3. `auto-flow [dense]? <auto-rows>? / <template-columns>` - Auto-flow rows
 * 4. `<template-rows> / auto-flow [dense]? <auto-columns>?` - Auto-flow columns
 *
 * Not supported (too complex, keep longhands):
 * - grid-template-areas with string values
 * - row-gap or column-gap with non-default values
 * - Complex template syntax with line names
 */
export const gridCollapser: CollapseHandler = createCollapseHandler({
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
      // They are reset by grid shorthand but not included in its syntax
    ],
  },

  collapse(properties: Record<string, string>): string | undefined {
    // Only the 6 grid longhands are required (not gaps)
    const required = [
      "grid-template-rows",
      "grid-template-columns",
      "grid-template-areas",
      "grid-auto-rows",
      "grid-auto-columns",
      "grid-auto-flow",
    ];

    for (const prop of required) {
      if (!properties[prop]) return undefined;
    }

    // Form 1: All defaults → "none"
    if (allDefaults(properties)) {
      return "none";
    }

    // Form 2: Template (with or without areas)
    if (canCollapseToTemplate(properties)) {
      const rows = properties["grid-template-rows"];
      const cols = properties["grid-template-columns"];
      const areas = properties["grid-template-areas"];

      // Case 2a: Template areas with rows/cols
      if (areas && areas !== "none") {
        // Split areas into rows
        const areaRows = areas.match(/"[^"]+"/g) || [];
        const rowSizes = rows.split(/\s+/);

        // Build: "area" size "area" size / cols
        const parts: string[] = [];
        for (let i = 0; i < areaRows.length; i++) {
          parts.push(areaRows[i]);
          if (i < rowSizes.length) {
            parts.push(rowSizes[i]);
          }
        }
        parts.push("/", cols);
        return parts.join(" ");
      }

      // Case 2b: Simple template without areas
      return `${rows} / ${cols}`;
    }

    // Form 3: Auto-flow columns → "rows / auto-flow [dense]? [auto-columns]?"
    if (canCollapseToAutoFlowColumns(properties)) {
      const rows = properties["grid-template-rows"];
      const flow = properties["grid-auto-flow"];
      const autoCols = properties["grid-auto-columns"];

      const parts = [rows, "/"];

      // Add auto-flow and optional dense
      if (flow === "row dense") {
        parts.push("auto-flow", "dense");
      } else {
        parts.push("auto-flow");
      }

      // Add auto-columns if not default
      if (!isDefault("grid-auto-columns", autoCols)) {
        parts.push(autoCols);
      }

      return parts.join(" ");
    }

    // Form 4: Auto-flow rows → "auto-flow [dense]? [auto-rows]? / columns"
    if (canCollapseToAutoFlowRows(properties)) {
      const cols = properties["grid-template-columns"];
      const flow = properties["grid-auto-flow"];
      const autoRows = properties["grid-auto-rows"];

      const parts = [];

      // Add auto-flow and optional dense
      if (flow === "column dense") {
        parts.push("auto-flow", "dense");
      } else {
        parts.push("auto-flow");
      }

      // Add auto-rows if not default
      if (!isDefault("grid-auto-rows", autoRows)) {
        parts.push(autoRows);
      }

      parts.push("/", cols);

      return parts.join(" ");
    }

    // Too complex to collapse - return undefined
    return undefined;
  },

  canCollapse(properties: Record<string, string>): boolean {
    // Only the 6 grid longhands are required (not gaps)
    const required = [
      "grid-template-rows",
      "grid-template-columns",
      "grid-template-areas",
      "grid-auto-rows",
      "grid-auto-columns",
      "grid-auto-flow",
    ];

    return required.every((prop) => prop in properties);
  },
});
