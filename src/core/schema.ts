// b_path:: src/core/schema.ts

/**
 * Base CSS value types
 */
export type CssValue = string;
export type CssProperty = string;
export type CssDeclaration = string;

/**
 * Output format enum
 * - 'css': Returns kebab-case CSS string (e.g., "margin-top: 10px;")
 * - 'js': Returns camelCase JavaScript object (e.g., { marginTop: '10px' })
 */
export const FORMAT_VALUES = ["css", "js"] as const;
export type Format = (typeof FORMAT_VALUES)[number];

/**
 * Property grouping strategy enum
 * - 'by-property': Groups by property type (e.g., all margins, then all borders)
 * - 'by-side': Groups by directional side (e.g., all top properties, then all right properties)
 */
export const PROPERTY_GROUPING_VALUES = ["by-property", "by-side"] as const;
export type PropertyGrouping = (typeof PROPERTY_GROUPING_VALUES)[number];

// Named constants for better readability
export const FORMAT_CSS = "css" as const;
export const FORMAT_JS = "js" as const;
export const GROUPING_BY_PROPERTY = "by-property" as const;
export const GROUPING_BY_SIDE = "by-side" as const;

/**
 * Options for CSS shorthand expansion
 */
export interface ExpandOptions {
  /** Output format: "css" (kebab-case string) or "js" (camelCase object). Default: "css" */
  format?: Format;

  /** Indentation spaces for CSS output (min: 0). Default: 0 */
  indent?: number;

  /** Separator between CSS declarations. Default: "\n" */
  separator?: string;

  /**
   * Property grouping strategy. Default: "by-property"
   * - 'by-property': Groups by property type (e.g., all margins, then all borders)
   * - 'by-side': Groups by directional side (e.g., all top properties, then all right properties)
   */
  propertyGrouping?: PropertyGrouping;

  /**
   * Expand partial directional longhand properties (e.g., margin-top) by filling in missing sides with CSS default values.
   * Default: false
   */
  expandPartialLonghand?: boolean;
}

/**
 * Enum-style namespace for ExpandOptions values
 * Provides better autocomplete and discoverability
 *
 * @example
 * ```typescript
 * import * as b from 'b_short';
 *
 * b.expand('background: red', {
 *   format: b.ExpandOptions.Format.CSS,
 *   propertyGrouping: b.ExpandOptions.PropertyGrouping.BY_PROPERTY,
 *   separator: b.ExpandOptions.Separator.NEWLINE,
 *   indent: b.ExpandOptions.Indent.NONE
 * });
 * ```
 */
export namespace ExpandOptions {
  /**
   * Output format values
   */
  export enum Format {
    /** CSS format: kebab-case strings like "margin-top: 10px;" */
    CSS = "css",
    /** JS format: camelCase objects like { marginTop: '10px' } */
    JS = "js",
  }

  /**
   * Property grouping strategy values
   */
  export enum PropertyGrouping {
    /** Group by property type (all margins, then all borders) */
    BY_PROPERTY = "by-property",
    /** Group by directional side (all top properties, then all right) */
    BY_SIDE = "by-side",
  }

  /**
   * Common separator values
   */
  export enum Separator {
    /** Newline separator (default) */
    NEWLINE = "\n",
    /** Space separator */
    SPACE = " ",
    /** Semicolon with space */
    SEMICOLON = "; ",
    /** Empty string (compact) */
    NONE = "",
  }

  /**
   * Common indentation values
   */
  export enum Indent {
    /** No indentation (default) */
    NONE = 0,
    /** 2 spaces */
    TWO_SPACES = 2,
    /** 4 spaces */
    FOUR_SPACES = 4,
    /** Tab character (8 spaces equivalent) */
    TAB = 8,
  }

  /**
   * Boolean option values for expandPartialLonghand
   */
  export const ExpandPartialLonghand = {
    /** Don't expand partial longhand properties (default) */
    DISABLED: false,
    /** Expand partial longhand properties with CSS defaults */
    ENABLED: true,
  } as const;
}

/**
 * Default values for ExpandOptions
 * Users can spread this and override specific values
 *
 * @example
 * ```typescript
 * import { expand, DEFAULT_EXPAND_OPTIONS } from 'b_short';
 *
 * const myOptions = {
 *   ...DEFAULT_EXPAND_OPTIONS,
 *   indent: 2,
 *   format: 'js'
 * };
 *
 * expand('margin: 10px', myOptions);
 * ```
 */
export const DEFAULT_EXPAND_OPTIONS: Required<ExpandOptions> = {
  format: "css",
  indent: 0,
  separator: "\n",
  propertyGrouping: "by-property",
  expandPartialLonghand: false,
};

/**
 * CSS Tree syntax parsing error
 */
export interface CssTreeSyntaxParseError {
  name: string;
  message: string;
  line?: number;
  column?: number;
  property?: string;
  offset?: number;
  length?: number;
}

/**
 * Custom warning for CSS property validation
 */
export interface BStyleWarning {
  /** CSS property that has the warning */
  property: string;
  /** Warning name/type */
  name: string;
  /** CSS syntax that caused the warning */
  syntax?: string;
  /** Formatted warning message for display */
  formattedWarning?: string;
}

/**
 * Single layer in a multi-layer background
 */
export interface BackgroundLayer {
  /** Background image (url, gradient, or none) */
  image?: string;
  /** Background position (e.g., '10px 20px') */
  position?: string;
  /** Background size (e.g., 'cover', '100px 200px') */
  size?: string;
  /** Background repeat (e.g., 'no-repeat', 'repeat-x') */
  repeat?: string;
  /** Background attachment (e.g., 'fixed', 'scroll') */
  attachment?: string;
  /** Background origin (e.g., 'padding-box', 'border-box') */
  origin?: string;
  /** Background clip (e.g., 'padding-box', 'border-box') */
  clip?: string;
}

/**
 * Result of parsing multi-layer background declaration
 */
export interface BackgroundResult {
  /** Array of background layers */
  layers: BackgroundLayer[];
  /** Global background color applied to all layers */
  color?: string;
}

/**
 * Single layer in a multi-layer mask
 */
export interface MaskLayer {
  /** Mask image (url, gradient, or none) */
  image?: string;
  /** Masking mode (e.g., 'alpha', 'luminance', 'match-source') */
  mode?: string;
  /** Mask position (e.g., '10px 20px', 'center') */
  position?: string;
  /** Mask size (e.g., 'cover', '100px 200px', 'auto') */
  size?: string;
  /** Mask repeat (e.g., 'no-repeat', 'repeat-x') */
  repeat?: string;
  /** Mask origin (e.g., 'padding-box', 'border-box', 'content-box') */
  origin?: string;
  /** Mask clip (e.g., 'padding-box', 'border-box', 'content-box', 'no-clip') */
  clip?: string;
  /** Mask composite (e.g., 'add', 'subtract', 'intersect', 'exclude') */
  composite?: string;
}

/**
 * Result of parsing multi-layer mask declaration
 */
export interface MaskResult {
  /** Array of mask layers */
  layers: MaskLayer[];
}

/**
 * Single layer in a multi-layer transition
 */
export interface TransitionLayer {
  /** Transition property (e.g., 'opacity', 'all', 'transform') */
  property?: string;
  /** Transition duration (e.g., '300ms', '0.5s') */
  duration?: string;
  /** Transition timing function (e.g., 'ease', 'cubic-bezier(0.4, 0, 0.2, 1)') */
  timingFunction?: string;
  /** Transition delay (e.g., '100ms', '0s') */
  delay?: string;
}

/**
 * Result of parsing multi-layer transition declaration
 */
export interface TransitionResult {
  /** Array of transition layers */
  layers: TransitionLayer[];
}

/**
 * Single layer in a multi-layer animation
 */
export interface AnimationLayer {
  /** Animation name (e.g., 'spin', 'none') */
  name?: string;
  /** Animation duration (e.g., '1s', '300ms') */
  duration?: string;
  /** Animation timing function (e.g., 'ease', 'cubic-bezier(0.4, 0, 0.2, 1)') */
  timingFunction?: string;
  /** Animation delay (e.g., '100ms', '0s') */
  delay?: string;
  /** Animation iteration count (e.g., '3', 'infinite') */
  iterationCount?: string;
  /** Animation direction (e.g., 'normal', 'reverse', 'alternate', 'alternate-reverse') */
  direction?: string;
  /** Animation fill mode (e.g., 'none', 'forwards', 'backwards', 'both') */
  fillMode?: string;
  /** Animation play state (e.g., 'running', 'paused') */
  playState?: string;
}

/**
 * Result of parsing multi-layer animation declaration
 */
export interface AnimationResult {
  /** Array of animation layers */
  layers: AnimationLayer[];
}

/**
 * Result of CSS shorthand expansion
 */
export interface ExpandResult {
  /** Whether expansion was successful (no syntax errors) */
  ok: boolean;
  /**
   * The expanded CSS result
   * - JavaScript object format (multiple declarations are merged, with later properties overriding earlier ones)
   * - CSS string format (multiple declarations are joined)
   * - undefined when input is empty or invalid
   */
  result?: Record<string, string> | string;
  /** Array of syntax errors and validation warnings */
  issues: Array<CssTreeSyntaxParseError | BStyleWarning>;
}

/**
 * Result of CSS stylesheet validation
 */
export interface StylesheetValidation {
  /** Whether validation passed (no errors) */
  ok: boolean;
  /** Array of syntax parsing errors */
  errors: CssTreeSyntaxParseError[];
  /** Array of property validation warnings */
  warnings: BStyleWarning[];
}

/**
 * Options for CSS shorthand collapse
 */
export interface CollapseOptions {
  /** Indentation spaces for CSS string output (min: 0). Default: 0 */
  indent?: number;
}

/**
 * Default values for CollapseOptions
 */
export const DEFAULT_COLLAPSE_OPTIONS: Required<CollapseOptions> = {
  indent: 0,
};

/**
 * Result of CSS shorthand collapse operation
 */
export interface CollapseResult {
  /** Whether collapse was successful (no errors) */
  ok: boolean;
  /**
   * The collapsed CSS result
   * - JavaScript object format
   * - CSS string format
   * - undefined when input is empty
   */
  result?: Record<string, string> | string;
  /** Array of warnings about incomplete longhands that couldn't be collapsed */
  issues: BStyleWarning[];
}
