// b_path:: src/index.ts

/**
 * b_short - Lightning-fast CSS shorthand expansion to longhand properties
 *
 * Main entry point exporting the public API.
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE API - Primary public exports
// ============================================================================

export { expand } from "./core/expand";
export { validate } from "./core/validate";

// ============================================================================
// TYPE EXPORTS - Configuration and result types
// ============================================================================

export type {
  BStyleWarning,
  ExpandOptions,
  ExpandResult,
  Format,
  PropertyGrouping,
  StylesheetValidation,
} from "./core/schema";

// ============================================================================
// LAYER TYPES - Multi-layer parsing result types
// ============================================================================

export type {
  AnimationLayer,
  AnimationResult,
  BackgroundLayer,
  BackgroundResult,
  MaskLayer,
  MaskResult,
  TransitionLayer,
  TransitionResult,
} from "./core/schema";

// ============================================================================
// CONSTANTS - Runtime enum values
// ============================================================================

export {
  FORMAT_CSS,
  FORMAT_JS,
  FORMAT_VALUES,
  GROUPING_BY_PROPERTY,
  GROUPING_BY_SIDE,
  PROPERTY_GROUPING_VALUES,
} from "./core/schema";
