// b_path:: src/handlers/grid/collapse-utils.ts

import { GRID_DEFAULTS } from "./expand";

/**
 * Check if a value equals the default for a property
 */
export function isDefault(property: keyof typeof GRID_DEFAULTS, value: string): boolean {
  return value === GRID_DEFAULTS[property];
}

/**
 * Check if all grid properties are at their defaults
 */
export function allDefaults(properties: Record<string, string>): boolean {
  return (
    isDefault("grid-template-rows", properties["grid-template-rows"]) &&
    isDefault("grid-template-columns", properties["grid-template-columns"]) &&
    isDefault("grid-template-areas", properties["grid-template-areas"]) &&
    isDefault("grid-auto-rows", properties["grid-auto-rows"]) &&
    isDefault("grid-auto-columns", properties["grid-auto-columns"]) &&
    isDefault("grid-auto-flow", properties["grid-auto-flow"])
  );
}

/**
 * Check if properties match template form:
 * grid: <template-rows> / <template-columns>
 * OR grid: [line-names]? <string> <track-size>? ]+ [ / <explicit-track-list> ]?
 */
export function canCollapseToTemplate(properties: Record<string, string>): boolean {
  const rows = properties["grid-template-rows"];
  const cols = properties["grid-template-columns"];
  const areas = properties["grid-template-areas"];

  // Auto properties must be at defaults
  // NOTE: row-gap and column-gap are NOT part of grid shorthand
  // so we don't check them here - they can have any value
  const autoDefaultsCheck =
    isDefault("grid-auto-rows", properties["grid-auto-rows"]) &&
    isDefault("grid-auto-columns", properties["grid-auto-columns"]) &&
    isDefault("grid-auto-flow", properties["grid-auto-flow"]);

  if (!autoDefaultsCheck) return false;

  // Case 1: Simple template - rows and columns (no areas)
  if (rows && cols && rows !== "none" && cols !== "none" && areas === "none") {
    return true;
  }

  // Case 2: Template with areas
  if (areas && areas !== "none" && rows && cols) {
    return true;
  }

  return false;
}

/**
 * Check if properties match auto-flow rows form:
 * grid: auto-flow [dense]? <auto-rows>? / <template-columns>
 */
export function canCollapseToAutoFlowRows(properties: Record<string, string>): boolean {
  const flow = properties["grid-auto-flow"];
  const cols = properties["grid-template-columns"];
  const rows = properties["grid-template-rows"];

  // Must have column flow
  if (!flow || flow === "row" || flow === "row dense") {
    return false;
  }

  // Must be column or column dense
  if (flow !== "column" && flow !== "column dense") {
    return false;
  }

  // Template rows must be none
  if (rows !== "none") {
    return false;
  }

  // Must have template columns
  if (!cols || cols === "none") {
    return false;
  }

  // Areas must be defaults (not part of auto-flow forms)
  // Gaps can have any value - they're not part of grid shorthand
  return isDefault("grid-template-areas", properties["grid-template-areas"]);
}

/**
 * Check if properties match auto-flow columns form:
 * grid: <template-rows> / auto-flow [dense]? <auto-columns>?
 */
export function canCollapseToAutoFlowColumns(properties: Record<string, string>): boolean {
  const flow = properties["grid-auto-flow"];
  const rows = properties["grid-template-rows"];
  const cols = properties["grid-template-columns"];

  // Must have row flow
  if (!flow || flow === "column" || flow === "column dense") {
    return false;
  }

  // Must be row or row dense
  if (flow !== "row" && flow !== "row dense") {
    return false;
  }

  // Template columns must be none
  if (cols !== "none") {
    return false;
  }

  // Must have template rows
  if (!rows || rows === "none") {
    return false;
  }

  // Areas must be defaults (not part of auto-flow forms)
  // Gaps can have any value - they're not part of grid shorthand
  return isDefault("grid-template-areas", properties["grid-template-areas"]);
}
