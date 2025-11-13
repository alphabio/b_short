// b_path:: src/internal/property-handler.ts

/**
 * Options for property handler behavior
 */
export interface PropertyHandlerOptions {
  /** Enable strict validation mode (reject invalid values). Default: false */
  strict?: boolean;
  /** Preserve custom properties (CSS variables) in output. Default: true */
  preserveCustomProperties?: boolean;
}

/**
 * Default values for PropertyHandlerOptions
 */
export const DEFAULT_PROPERTY_HANDLER_OPTIONS: Required<PropertyHandlerOptions> = {
  strict: false,
  preserveCustomProperties: true,
};

/**
 * Property category enumeration
 */
export const PROPERTY_CATEGORIES = [
  "box-model",
  "visual",
  "layout",
  "animation",
  "typography",
  "border",
  "grid",
  "position",
  "positioning",
  "other",
] as const;

export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

/**
 * Metadata describing a property handler
 */
export interface PropertyHandlerMetadata {
  /** The shorthand property name (e.g., 'border') */
  shorthand: string;
  /** Array of longhand property names this shorthand expands to */
  longhands: string[];
  /** Default values for longhand properties when not specified */
  defaults?: Record<string, string>;
  /** Property category classification */
  category: PropertyCategory;
}

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
        // Apply default options
        const validatedOptions: Required<PropertyHandlerOptions> = {
          ...DEFAULT_PROPERTY_HANDLER_OPTIONS,
          ...options,
        };

        // Call the underlying expand function with validated options
        return config.expand(value, validatedOptions);
      } catch (_error) {
        // Return undefined on any errors (invalid options, parsing failures, etc.)
        return undefined;
      }
    },
  };
}
