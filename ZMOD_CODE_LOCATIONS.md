# Zod Code Locations - Complete Reference

## Import Locations (2 files)

### 1. `src/core/schema.ts` (Primary location - 30+ schemas)

```typescript
import { z } from "zod";

// All schemas are compile-time only - used for z.infer<> type derivation
export const CssValueSchema = z.string().describe("CSS property value");
export const CssPropertySchema = z.string().describe("CSS property name");
export const CssDeclarationSchema = z.string().describe("CSS declaration string");
export const FormatEnumSchema = z.enum(["css", "js"]);
export const PropertyGroupingEnumSchema = z.enum(["by-property", "by-side"]);
export const ExpandOptionsSchema = z.object({...});
export const CssTreeSyntaxParseErrorSchema = z.object({...});
export const BStyleWarningSchema = z.object({...});
export const BackgroundLayerSchema = z.object({...});
export const BackgroundResultSchema = z.object({...});
export const MaskLayerSchema = z.object({...});
export const MaskResultSchema = z.object({...});
export const TransitionLayerSchema = z.object({...});
export const TransitionResultSchema = z.object({...});
export const AnimationLayerSchema = z.object({...});
export const AnimationResultSchema = z.object({...});
export const ExpandResultSchema = z.object({...});
export const StylesheetValidationSchema = z.object({...});

// All types derived via z.infer<>
export type Format = z.infer<typeof FormatEnumSchema>;
export type PropertyGrouping = z.infer<typeof PropertyGroupingEnumSchema>;
// ... etc for all schemas
```

**Usage:** Type derivation only - no runtime validation

### 2. `src/internal/property-handler.ts` (Validation only)

```typescript
import { z } from "zod";

export const PropertyHandlerOptionsSchema = z.object({
  strict: z.boolean().default(false).describe("..."),
  preserveCustomProperties: z.boolean().default(true).describe("..."),
}).describe("Options for property handler behavior");

export type PropertyHandlerOptions = z.infer<typeof PropertyHandlerOptionsSchema>;
```

**Usage:** Type derivation + runtime validation (2 calls)

## Runtime Validation Locations (3 total)

### Location 1: `src/core/validate.ts:183`

**File:** `src/core/validate.ts`
**Line:** 183
**Function:** `validate(css: string): StylesheetValidation`

```typescript
export function validate(css: string): StylesheetValidation {
  const errors: csstree.SyntaxParseError[] = [];
  const warnings: BStyleMatchError[] = [];
  const declarations: Declaration[] = [];
  const syntax = csstree.lexer;
  const uniqueDecls = new Map<string, number>();

  // ... ~170 lines of validation logic using css-tree ...

  const formattedWarnings: BStyleWarning[] = [];
  // ... ~10 lines of warning formatting ...

  const result = {
    ok: errors.length === 0,
    errors,
    warnings: formattedWarnings,
  };

  // ⚠️ RUNTIME VALIDATION #1 (line 183)
  return StylesheetValidationSchema.parse(result);
}
```

**What's validated:**

```typescript
{
  ok: boolean,
  errors: Array<{
    name: string,
    message: string,
    line: number,
    column: number,
    property?: string,
    offset?: number,
    length?: number
  }>,
  warnings: Array<{
    property: string,
    name: string,
    syntax?: string,
    formattedWarning?: string
  }>
}
```

**Why it's unnecessary:**

- Object is constructed in the same function
- TypeScript already guarantees type correctness
- No external input being validated
- Adding ~40 KB for validating our own output

**Replacement:**

```typescript
// Just return it directly - TypeScript guarantees correctness
return result;
```

---

### Location 2 & 3: `src/internal/property-handler.ts:178-179`

**File:** `src/internal/property-handler.ts`
**Lines:** 178-179
**Function:** `createPropertyHandler(config: PropertyHandler): PropertyHandler`

```typescript
export function createPropertyHandler(config: PropertyHandler): PropertyHandler {
  return {
    ...config,
    expand: (
      value: string,
      options?: PropertyHandlerOptions
    ): Record<string, string> | undefined => {
      try {
        // ⚠️ RUNTIME VALIDATION #2 (line 178)
        // ⚠️ RUNTIME VALIDATION #3 (line 179)
        const validatedOptions = options
          ? PropertyHandlerOptionsSchema.parse(options)
          : PropertyHandlerOptionsSchema.parse({});

        return config.expand(value, validatedOptions);
      } catch (_error) {
        return undefined;
      }
    },
  };
}
```

**What's validated:**

```typescript
{
  strict?: boolean,              // default: false
  preserveCustomProperties?: boolean,  // default: true
}
```

**Why it's trivial:**

- Two optional boolean fields
- Defaults are simple
- No complex validation logic needed
- TypeScript can enforce this at compile time

**Replacement:**

```typescript
const validatedOptions: PropertyHandlerOptions = {
  strict: options?.strict ?? false,
  preserveCustomProperties: options?.preserveCustomProperties ?? true,
};
```

---

## Export Locations (Schema Exports)

### `src/core/schema.ts` - Schema Exports

```typescript
// Export schemas for runtime validation (never used except 1 place)
export const schemas = {
  Format: FormatEnumSchema,
  PropertyGrouping: PropertyGroupingEnumSchema,
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
```

**Usage:** Exported but rarely used by consumers (maybe for custom validation)

### `src/index.ts` - Public API

```typescript
// No Zod imports in index.ts
// Only exports types (which are derived from Zod schemas)

export type {
  BStyleWarning,
  ExpandOptions,
  ExpandResult,
  Format,
  PropertyGrouping,
  StylesheetValidation,
} from "./core/schema";

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

export {
  FORMAT_CSS,
  FORMAT_JS,
  FORMAT_VALUES,
  GROUPING_BY_PROPERTY,
  GROUPING_BY_SIDE,
  PROPERTY_GROUPING_VALUES,
} from "./core/schema";
```

**Impact:** No runtime Zod code in main entry point (good!)

---

## Files That DON'T Use Zod (50+ files)

All shorthand property handlers:

- `src/animation.ts`, `src/animation-layers.ts`
- `src/background.ts`, `src/background-layers.ts`
- `src/border.ts`, `src/border-radius.ts`
- `src/flex.ts`, `src/flex-flow.ts`
- `src/grid.ts`, `src/grid-*.ts`
- `src/mask.ts`, `src/mask-layers.ts`
- `src/transition.ts`, `src/transition-layers.ts`
- `src/font.ts`, `src/columns.ts`, `src/overflow.ts`
- ... and 30+ more

All internal utilities:

- `src/internal/color-utils.ts`
- `src/internal/css-defaults.ts`
- `src/internal/directional.ts`
- `src/internal/is-*.ts` (color, length, angle, time, etc.)
- `src/internal/parsers.ts`
- `src/internal/property-sorter.ts`
- `src/internal/shorthand-registry.ts`
- ... etc

**None of these files use Zod.**

---

## Summary: Zod Usage Density

```
Total source files:        ~50 files
Files importing Zod:       2 files (4%)
Runtime .parse() calls:    3 calls
Schemas defined:           30+ schemas
Schemas used at runtime:   2 schemas (6.6%)
```

**Conclusion:** Massive overhead for minimal benefit.

---

## Quick Grep Commands

```bash
# Find all Zod imports
grep -r "import.*zod" src/ --include="*.ts"

# Find all .parse() calls (Zod runtime validation)
grep -n "\.parse(" src/ -r --include="*.ts" | grep -v "csstree.parse\|JSON.parse\|parseInputString\|parseCssDeclaration\|parseInt\|parseFloat"

# Find all z. usage (Zod schema definitions)
grep -r "z\." src/ --include="*.ts" | wc -l

# Find all z.infer usage (type derivation)
grep -r "z\.infer" src/ --include="*.ts"
```

---

**Generated:** 2025-10-28
**Purpose:** Complete code-level reference for Zod removal
