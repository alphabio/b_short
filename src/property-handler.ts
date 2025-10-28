// b_path:: src/property-handler.ts
import { z } from "zod";

/**
 * Schema for property handler options
 */
export const PropertyHandlerOptionsSchema = z
  .object({
    strict: z
      .boolean()
      .default(false)
      .describe("Enable strict validation mode (reject invalid values)"),
    preserveCustomProperties: z
      .boolean()
      .default(true)
      .describe("Preserve custom properties (CSS variables) in output"),
  })
  .describe("Options for property handler behavior");

/**
 * Derived type for property handler options
 */
export type PropertyHandlerOptions = z.infer<typeof PropertyHandlerOptionsSchema>;

/**
 * Property category enumeration schema
 */
export const PropertyCategorySchema = z.enum([
  "box-model",
  "visual",
  "layout",
  "animation",
  "typography",
  "other",
]);

/**
 * Derived type for property categories
 */
export type PropertyCategory = z.infer<typeof PropertyCategorySchema>;

/**
 * Schema for property handler metadata
 */
export const PropertyHandlerMetadataSchema = z
  .object({
    shorthand: z.string().describe("The shorthand property name (e.g., 'border')"),
    longhands: z
      .array(z.string())
      .describe("Array of longhand property names this shorthand expands to"),
    defaults: z
      .record(z.string(), z.string())
      .optional()
      .describe("Default values for longhand properties when not specified"),
    category: PropertyCategorySchema.describe("Property category classification"),
  })
  .describe("Metadata describing a property handler");

/**
 * Derived type for property handler metadata
 */
export type PropertyHandlerMetadata = z.infer<typeof PropertyHandlerMetadataSchema>;

/**
 * Property handler interface for CSS shorthand expansion
 *
 * All property handlers must implement this interface to ensure:
 * - Consistent API across all handlers
 * - Type-safe expansion logic
 * - Introspection capabilities
 * - Future extensibility (e.g., collapse API)
 */
export interface PropertyHandler {
  /**
   * Metadata describing the handler's properties
   */
  readonly meta: PropertyHandlerMetadata;

  /**
   * Expand a CSS shorthand value into its longhand properties
   *
   * @param value - The CSS value to expand
   * @param options - Optional handler options
   * @returns Object mapping longhand property names to values, or undefined if invalid
   *
   * @example
   * ```typescript
   * const handler = overflowHandler;
   * handler.expand('hidden auto'); // { 'overflow-x': 'hidden', 'overflow-y': 'auto' }
   * handler.expand('invalid'); // undefined
   * ```
   */
  expand(value: string, options?: PropertyHandlerOptions): Record<string, string> | undefined;

  /**
   * Optional: Validate a CSS value without expanding it
   *
   * @param value - The CSS value to validate
   * @returns true if valid, false otherwise
   */
  validate?(value: string): boolean;

  /**
   * Optional: Reconstruct a shorthand value from longhand properties (future feature)
   *
   * This method enables the "collapse API" - converting longhand properties back
   * into their shorthand equivalent.
   *
   * @param properties - Object mapping longhand property names to values
   * @returns The reconstructed shorthand value, or undefined if cannot be collapsed
   *
   * @example
   * ```typescript
   * const handler = overflowHandler;
   * handler.reconstruct?.({ 'overflow-x': 'hidden', 'overflow-y': 'hidden' }); // 'hidden'
   * handler.reconstruct?.({ 'overflow-x': 'hidden', 'overflow-y': 'auto' }); // 'hidden auto'
   * ```
   */
  reconstruct?(properties: Record<string, string>): string | undefined;

  /**
   * Optional: Sub-handlers for related shorthands
   *
   * Some properties like 'border' have sub-properties (border-width, border-style, etc.)
   * that are themselves shorthands. This allows hierarchical composition.
   *
   * @example
   * ```typescript
   * const borderHandler: PropertyHandler = {
   *   meta: { shorthand: 'border', ... },
   *   expand: (value) => { ... },
   *   handlers: {
   *     width: borderWidthHandler,
   *     style: borderStyleHandler,
   *     color: borderColorHandler,
   *   }
   * };
   * ```
   */
  readonly handlers?: Readonly<Record<string, PropertyHandler>>;
}

/**
 * Factory function for creating property handlers with consistent behavior
 *
 * This factory wraps handler logic with:
 * - Option validation and defaults
 * - Error handling (returns undefined on exceptions)
 * - Consistent return types
 *
 * @param config - Property handler configuration
 * @returns A fully-formed PropertyHandler instance
 *
 * @example
 * ```typescript
 * export const overflowHandler = createPropertyHandler({
 *   meta: {
 *     shorthand: 'overflow',
 *     longhands: ['overflow-x', 'overflow-y'],
 *     category: 'visual',
 *   },
 *   expand: (value) => {
 *     // Handler implementation
 *   },
 * });
 * ```
 */
export function createPropertyHandler(config: PropertyHandler): PropertyHandler {
  return {
    ...config,
    expand: (
      value: string,
      options?: PropertyHandlerOptions
    ): Record<string, string> | undefined => {
      try {
        // Validate options if provided
        const validatedOptions = options
          ? PropertyHandlerOptionsSchema.parse(options)
          : PropertyHandlerOptionsSchema.parse({});

        // Call the underlying expand function with validated options
        return config.expand(value, validatedOptions);
      } catch (_error) {
        // Return undefined on any errors (invalid options, parsing failures, etc.)
        return undefined;
      }
    },
  };
}
