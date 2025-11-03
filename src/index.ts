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
  ExpandResult,
  Format,
  PropertyGrouping,
  StylesheetValidation,
} from "./core/schema";

// Export ExpandOptions as namespace (includes both interface and enums)
export { ExpandOptions } from "./core/schema";

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
  DEFAULT_EXPAND_OPTIONS,
  FORMAT_CSS,
  FORMAT_JS,
  FORMAT_VALUES,
  GROUPING_BY_PROPERTY,
  GROUPING_BY_SIDE,
  PROPERTY_GROUPING_VALUES,
} from "./core/schema";

// ============================================================================
// PROPERTY HANDLERS - Advanced API for direct handler access
// ============================================================================

// Individual property handlers (refactored with PropertyHandler interface)
export { columnsHandler } from "./columns";
export { containIntrinsicSizeHandler } from "./contain-intrinsic-size";
export { flexFlowHandler } from "./flex-flow";
export type {
  PropertyCategory,
  PropertyHandler,
  PropertyHandlerMetadata,
  PropertyHandlerOptions,
} from "./internal/property-handler";
export { createPropertyHandler, PROPERTY_CATEGORIES } from "./internal/property-handler";
export { listStyleHandler } from "./list-style";
export { overflowHandler } from "./overflow";
export { placeContentHandler } from "./place-content";
export { placeItemsHandler } from "./place-items";
export { placeSelfHandler } from "./place-self";
