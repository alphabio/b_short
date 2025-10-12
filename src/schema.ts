// b_path:: src/schema.ts
import { z } from "zod";

// Base CSS value schemas
export const CssValueSchema = z.string().describe("CSS property value");
export const CssPropertySchema = z.string().describe("CSS property name");
export const CssDeclarationSchema = z.string().describe("CSS declaration string");

// Format options schema
export const ExpandOptionsSchema = z
  .object({
    format: z.enum(["js", "css"]).default("css").optional().describe("Output format"),
    indent: z.number().min(0).default(0).optional().describe("Indentation for CSS output"),
    separator: z.string().default("\n").optional().describe("Separator between CSS declarations"),
    propertyGrouping: z
      .enum(["by-property", "by-side"])
      .default("by-property")
      .optional()
      .describe(
        "Property grouping strategy: 'by-property' groups by property type (e.g., all margins, then all borders), 'by-side' groups by directional side (e.g., all top properties, then all right properties)"
      ),
  })
  .describe("Options for CSS expansion");

/**
 * CSS Tree and custom warning types for validation
 */
export const CssTreeSyntaxParseErrorSchema = z
  .object({
    name: z.string(),
    message: z.string(),
    line: z.number(),
    column: z.number(),
    property: z.string().optional(),
    offset: z.number().optional(),
    length: z.number().optional(),
  })
  .describe("CSS Tree syntax parsing error");

export const BStyleWarningSchema = z
  .object({
    property: z.string().describe("CSS property that has the warning"),
    name: z.string().describe("Warning name/type"),
    syntax: z.string().optional().describe("CSS syntax that caused the warning"),
    formattedWarning: z.string().optional().describe("Formatted warning message for display"),
  })
  .describe("Custom warning for CSS property validation");

/**
 * Background layer schema for multi-layer background parsing
 */
export const BackgroundLayerSchema = z
  .object({
    image: z.string().optional().describe("Background image (url, gradient, or none)"),
    position: z.string().optional().describe("Background position (e.g., '10px 20px')"),
    size: z.string().optional().describe("Background size (e.g., 'cover', '100px 200px')"),
    repeat: z.string().optional().describe("Background repeat (e.g., 'no-repeat', 'repeat-x')"),
    attachment: z.string().optional().describe("Background attachment (e.g., 'fixed', 'scroll')"),
    origin: z.string().optional().describe("Background origin (e.g., 'padding-box', 'border-box')"),
    clip: z.string().optional().describe("Background clip (e.g., 'padding-box', 'border-box')"),
  })
  .describe("Single layer in a multi-layer background");

/**
 * Multi-layer background parsing result
 */
export const BackgroundResultSchema = z
  .object({
    layers: z.array(BackgroundLayerSchema).describe("Array of background layers"),
    color: z.string().optional().describe("Global background color applied to all layers"),
  })
  .describe("Result of parsing multi-layer background declaration");

/**
 * Mask layer schema for multi-layer mask parsing
 */
export const MaskLayerSchema = z
  .object({
    image: z.string().optional().describe("Mask image (url, gradient, or none)"),
    mode: z
      .string()
      .optional()
      .describe("Masking mode (e.g., 'alpha', 'luminance', 'match-source')"),
    position: z.string().optional().describe("Mask position (e.g., '10px 20px', 'center')"),
    size: z.string().optional().describe("Mask size (e.g., 'cover', '100px 200px', 'auto')"),
    repeat: z.string().optional().describe("Mask repeat (e.g., 'no-repeat', 'repeat-x')"),
    origin: z
      .string()
      .optional()
      .describe("Mask origin (e.g., 'padding-box', 'border-box', 'content-box')"),
    clip: z
      .string()
      .optional()
      .describe("Mask clip (e.g., 'padding-box', 'border-box', 'content-box', 'no-clip')"),
    composite: z
      .string()
      .optional()
      .describe("Mask composite (e.g., 'add', 'subtract', 'intersect', 'exclude')"),
  })
  .describe("Single layer in a multi-layer mask");

/**
 * Multi-layer mask parsing result
 */
export const MaskResultSchema = z
  .object({
    layers: z.array(MaskLayerSchema).describe("Array of mask layers"),
  })
  .describe("Result of parsing multi-layer mask declaration");

/**
 * Transition layer schema for multi-layer transition parsing
 */
export const TransitionLayerSchema = z
  .object({
    property: z
      .string()
      .optional()
      .describe("Transition property (e.g., 'opacity', 'all', 'transform')"),
    duration: z.string().optional().describe("Transition duration (e.g., '300ms', '0.5s')"),
    timingFunction: z
      .string()
      .optional()
      .describe("Transition timing function (e.g., 'ease', 'cubic-bezier(0.4, 0, 0.2, 1)')"),
    delay: z.string().optional().describe("Transition delay (e.g., '100ms', '0s')"),
  })
  .describe("Single layer in a multi-layer transition");

/**
 * Multi-layer transition parsing result
 */
export const TransitionResultSchema = z
  .object({
    layers: z.array(TransitionLayerSchema).describe("Array of transition layers"),
  })
  .describe("Result of parsing multi-layer transition declaration");

/**
 * Animation layer schema for multi-layer animation parsing
 */
export const AnimationLayerSchema = z
  .object({
    name: z.string().optional().describe("Animation name (e.g., 'spin', 'none')"),
    duration: z.string().optional().describe("Animation duration (e.g., '1s', '300ms')"),
    timingFunction: z
      .string()
      .optional()
      .describe("Animation timing function (e.g., 'ease', 'cubic-bezier(0.4, 0, 0.2, 1)')"),
    delay: z.string().optional().describe("Animation delay (e.g., '100ms', '0s')"),
    iterationCount: z
      .string()
      .optional()
      .describe("Animation iteration count (e.g., '3', 'infinite')"),
    direction: z
      .string()
      .optional()
      .describe(
        "Animation direction (e.g., 'normal', 'reverse', 'alternate', 'alternate-reverse')"
      ),
    fillMode: z
      .string()
      .optional()
      .describe("Animation fill mode (e.g., 'none', 'forwards', 'backwards', 'both')"),
    playState: z.string().optional().describe("Animation play state (e.g., 'running', 'paused')"),
  })
  .describe("Single layer in a multi-layer animation");

/**
 * Multi-layer animation parsing result
 */
export const AnimationResultSchema = z
  .object({
    layers: z.array(AnimationLayerSchema).describe("Array of animation layers"),
  })
  .describe("Result of parsing multi-layer animation declaration");

/**
 * Main expansion result schema
 */
export const ExpandResultSchema = z
  .object({
    ok: z.boolean().describe("Whether expansion was successful (no syntax errors)"),
    result: z
      .union([
        z
          .record(z.string(), z.string())
          .describe(
            "JavaScript object format result (multiple declarations are merged, with later properties overriding earlier ones)"
          ),
        z.string().describe("CSS string format result (multiple declarations are joined)"),
        z.undefined().describe("No result when input is empty or invalid"),
      ])
      .describe("The expanded CSS result"),
    issues: z
      .array(z.union([CssTreeSyntaxParseErrorSchema, BStyleWarningSchema]))
      .describe("Array of syntax errors and validation warnings"),
  })
  .describe("Result of CSS shorthand expansion");

/**
 * Stylesheet validation result schema
 */
export const StylesheetValidationSchema = z
  .object({
    ok: z.boolean().describe("Whether validation passed (no errors)"),
    errors: z.array(CssTreeSyntaxParseErrorSchema).describe("Array of syntax parsing errors"),
    warnings: z.array(BStyleWarningSchema).describe("Array of property validation warnings"),
  })
  .describe("Result of CSS stylesheet validation");

// Derived TypeScript types from schemas
export type ExpandOptions = z.infer<typeof ExpandOptionsSchema>;
export type ExpandResult = z.infer<typeof ExpandResultSchema>;
export type BackgroundLayer = z.infer<typeof BackgroundLayerSchema>;
export type BackgroundResult = z.infer<typeof BackgroundResultSchema>;
export type MaskLayer = z.infer<typeof MaskLayerSchema>;
export type MaskResult = z.infer<typeof MaskResultSchema>;
export type TransitionLayer = z.infer<typeof TransitionLayerSchema>;
export type TransitionResult = z.infer<typeof TransitionResultSchema>;
export type AnimationLayer = z.infer<typeof AnimationLayerSchema>;
export type AnimationResult = z.infer<typeof AnimationResultSchema>;
export type BStyleWarning = z.infer<typeof BStyleWarningSchema>;
export type StylesheetValidation = z.infer<typeof StylesheetValidationSchema>;
export type CssValue = z.infer<typeof CssValueSchema>;
export type CssProperty = z.infer<typeof CssPropertySchema>;
export type CssDeclaration = z.infer<typeof CssDeclarationSchema>;

// Export schemas for runtime validation
export const schemas = {
  ExpandOptions: ExpandOptionsSchema,
  ExpandResult: ExpandResultSchema,
  BackgroundLayer: BackgroundLayerSchema,
  BackgroundResult: BackgroundResultSchema,
  MaskLayer: MaskLayerSchema,
  MaskResult: MaskResultSchema,
  TransitionLayer: TransitionLayerSchema,
  TransitionResult: TransitionResultSchema,
  AnimationLayer: AnimationLayerSchema,
  AnimationResult: AnimationResultSchema,
  BStyleWarning: BStyleWarningSchema,
  StylesheetValidation: StylesheetValidationSchema,
  CssValue: CssValueSchema,
  CssProperty: CssPropertySchema,
  CssDeclaration: CssDeclarationSchema,
} as const;
