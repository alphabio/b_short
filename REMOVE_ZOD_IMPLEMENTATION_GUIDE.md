# 🔧 Remove Zod Implementation Guide

**Task:** Remove Zod dependency while maintaining 100% API compatibility and type safety.

**Expected Outcome:** 40% bundle size reduction (107 KB → 63-67 KB), zero breaking changes.

---

## 📋 Implementation Checklist

- [ ] **Step 1:** Backup current state
- [ ] **Step 2:** Replace `src/core/schema.ts` 
- [ ] **Step 3:** Update `src/core/validate.ts`
- [ ] **Step 4:** Update `src/internal/property-handler.ts`
- [ ] **Step 5:** Update `src/core/expand.ts` (options handling)
- [ ] **Step 6:** Remove Zod from `package.json`
- [ ] **Step 7:** Run tests
- [ ] **Step 8:** Build and measure bundle size
- [ ] **Step 9:** Update documentation

---

## 🎯 Key Requirement from User

> "I would like to export options to assist the user construct the expand"

**Action:** Export a helper object with default values for `ExpandOptions` so users can easily construct options.

```typescript
// User wants something like:
import { expand, DEFAULT_EXPAND_OPTIONS } from 'b_short';

const myOptions = {
  ...DEFAULT_EXPAND_OPTIONS,
  indent: 2,
  format: 'js'
};

expand('margin: 10px', myOptions);
```

---

## 📂 STEP 1: Backup Current State

```bash
git checkout -b refactor/remove-zod
git commit -am "Checkpoint before Zod removal"
```

---

## 📂 STEP 2: Replace `src/core/schema.ts`

**Current file:** Uses Zod for all schemas (~400 lines)

**New file:** Pure TypeScript types/interfaces (~300 lines)

### 2.1 Replace Enum Schemas

**Before:**
```typescript
import { z } from "zod";

export const FormatEnumSchema = z.enum(["css", "js"]);
export type Format = z.infer<typeof FormatEnumSchema>;
export const FORMAT_VALUES = FormatEnumSchema.options;
```

**After:**
```typescript
// No imports needed

export const FORMAT_VALUES = ["css", "js"] as const;
export type Format = typeof FORMAT_VALUES[number];
```

**Apply to:**
- `FormatEnumSchema` → `Format`
- `PropertyGroupingEnumSchema` → `PropertyGrouping`
- `PropertyCategorySchema` → `PropertyCategory`

### 2.2 Replace Object Schemas with Interfaces

**Before:**
```typescript
export const ExpandOptionsSchema = z.object({
  format: FormatEnumSchema.default("css").describe("Output format"),
  indent: z.number().min(0).default(0).describe("Indentation for CSS output"),
  separator: z.string().default("\n").describe("Separator between CSS declarations"),
  propertyGrouping: PropertyGroupingEnumSchema.default("by-property").describe("..."),
  expandPartialLonghand: z.boolean().default(false).describe("..."),
});
export type ExpandOptions = z.infer<typeof ExpandOptionsSchema>;
```

**After:**
```typescript
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
  
  /** Property grouping strategy. Default: "by-property" */
  propertyGrouping?: PropertyGrouping;
  
  /** Expand partial directional properties with CSS defaults. Default: false */
  expandPartialLonghand?: boolean;
}

/**
 * Default values for ExpandOptions
 * Users can spread this and override specific values
 */
export const DEFAULT_EXPAND_OPTIONS: Required<ExpandOptions> = {
  format: "css",
  indent: 0,
  separator: "\n",
  propertyGrouping: "by-property",
  expandPartialLonghand: false,
};
```

**Apply to ALL schemas:**
- `ExpandOptionsSchema` → `ExpandOptions` + `DEFAULT_EXPAND_OPTIONS`
- `PropertyHandlerOptionsSchema` → `PropertyHandlerOptions` + defaults
- `BackgroundLayerSchema` → `BackgroundLayer`
- `BackgroundResultSchema` → `BackgroundResult`
- `MaskLayerSchema` → `MaskLayer`
- `MaskResultSchema` → `MaskResult`
- `TransitionLayerSchema` → `TransitionLayer`
- `TransitionResultSchema` → `TransitionResult`
- `AnimationLayerSchema` → `AnimationLayer`
- `AnimationResultSchema` → `AnimationResult`
- `BStyleWarningSchema` → `BStyleWarning`
- `StylesheetValidationSchema` → `StylesheetValidation`
- `CssTreeSyntaxParseErrorSchema` → `CssTreeSyntaxParseError`
- `PropertyHandlerMetadataSchema` → `PropertyHandlerMetadata`

### 2.3 Remove `schemas` Export Object

**Delete this entire block:**
```typescript
export const schemas = {
  Format: FormatEnumSchema,
  PropertyGrouping: PropertyGroupingEnumSchema,
  // ... etc
} as const;
```

It's not used anywhere and not exported in public API.

### 2.4 Keep Constants

**Keep these (no changes):**
```typescript
export const FORMAT_CSS = "css" as const;
export const FORMAT_JS = "js" as const;
export const GROUPING_BY_PROPERTY = "by-property" as const;
export const GROUPING_BY_SIDE = "by-side" as const;
```

---

## 📂 STEP 3: Update `src/core/validate.ts`

**File:** `src/core/validate.ts`  
**Line:** 183  
**Change:** Remove Zod validation

### Before:
```typescript
import {
  type BStyleWarning,
  type StylesheetValidation,
  StylesheetValidationSchema,
} from "./schema";

export function validate(css: string): StylesheetValidation {
  // ... ~170 lines of validation ...
  
  const result = {
    ok: errors.length === 0,
    errors,
    warnings: formattedWarnings,
  };

  return StylesheetValidationSchema.parse(result);  // ← REMOVE THIS
}
```

### After:
```typescript
import type { BStyleWarning, StylesheetValidation } from "./schema";
// Note: removed StylesheetValidationSchema import

export function validate(css: string): StylesheetValidation {
  // ... ~170 lines of validation ...
  
  return {
    ok: errors.length === 0,
    errors,
    warnings: formattedWarnings,
  };  // ← Direct return (TypeScript guarantees type safety)
}
```

**Rationale:** We're validating our own output. TypeScript already guarantees correctness.

---

## 📂 STEP 4: Update `src/internal/property-handler.ts`

**File:** `src/internal/property-handler.ts`  
**Lines:** 178-179  
**Change:** Remove Zod validation, use simple defaults

### 4.1 Remove Zod Import

**Before:**
```typescript
import { z } from "zod";
```

**After:**
```typescript
// No Zod import needed
```

### 4.2 Replace Schema with Interface + Defaults

**Before:**
```typescript
export const PropertyHandlerOptionsSchema = z.object({
  strict: z.boolean().default(false).describe("..."),
  preserveCustomProperties: z.boolean().default(true).describe("..."),
}).describe("Options for property handler behavior");

export type PropertyHandlerOptions = z.infer<typeof PropertyHandlerOptionsSchema>;
```

**After:**
```typescript
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
```

### 4.3 Replace Validation in createPropertyHandler

**Before:**
```typescript
export function createPropertyHandler(config: PropertyHandler): PropertyHandler {
  return {
    ...config,
    expand: (value: string, options?: PropertyHandlerOptions) => {
      try {
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

**After:**
```typescript
export function createPropertyHandler(config: PropertyHandler): PropertyHandler {
  return {
    ...config,
    expand: (value: string, options?: PropertyHandlerOptions) => {
      const normalizedOptions: PropertyHandlerOptions = {
        strict: options?.strict ?? DEFAULT_PROPERTY_HANDLER_OPTIONS.strict,
        preserveCustomProperties: options?.preserveCustomProperties ?? 
          DEFAULT_PROPERTY_HANDLER_OPTIONS.preserveCustomProperties,
      };
      return config.expand(value, normalizedOptions);
    },
  };
}
```

**Rationale:** Simple property access with defaults. No validation needed (TypeScript enforces types).

### 4.4 Remove PropertyHandlerOptionsSchema References

**Search for:** `PropertyHandlerOptionsSchema`  
**Replace with:** Just use the type `PropertyHandlerOptions`

---

## 📂 STEP 5: Update `src/core/expand.ts`

**File:** `src/core/expand.ts`  
**Change:** Use new DEFAULT_EXPAND_OPTIONS for option defaults

### Before:
```typescript
export function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  const {
    format = FORMAT_CSS,
    indent = 0,
    separator = "\n",
    propertyGrouping = GROUPING_BY_PROPERTY,
    expandPartialLonghand = false,
  } = options;
  // ...
}
```

**After:**
```typescript
import { DEFAULT_EXPAND_OPTIONS } from "./schema";

export function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  const {
    format = DEFAULT_EXPAND_OPTIONS.format,
    indent = DEFAULT_EXPAND_OPTIONS.indent,
    separator = DEFAULT_EXPAND_OPTIONS.separator,
    propertyGrouping = DEFAULT_EXPAND_OPTIONS.propertyGrouping,
    expandPartialLonghand = DEFAULT_EXPAND_OPTIONS.expandPartialLonghand,
  } = options;
  // ...
}
```

**Or more concisely:**
```typescript
export function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  const opts = { ...DEFAULT_EXPAND_OPTIONS, ...options };
  const { format, indent, separator, propertyGrouping, expandPartialLonghand } = opts;
  // ...
}
```

---

## 📂 STEP 6: Update `src/index.ts`

**Add DEFAULT_EXPAND_OPTIONS export per user request**

### Before:
```typescript
export {
  FORMAT_CSS,
  FORMAT_JS,
  FORMAT_VALUES,
  GROUPING_BY_PROPERTY,
  GROUPING_BY_SIDE,
  PROPERTY_GROUPING_VALUES,
} from "./core/schema";
```

### After:
```typescript
export {
  FORMAT_CSS,
  FORMAT_JS,
  FORMAT_VALUES,
  GROUPING_BY_PROPERTY,
  GROUPING_BY_SIDE,
  PROPERTY_GROUPING_VALUES,
  DEFAULT_EXPAND_OPTIONS,  // ← ADD THIS (per user request)
} from "./core/schema";
```

**User benefit:**
```typescript
import { expand, DEFAULT_EXPAND_OPTIONS } from 'b_short';

// Easy option construction
const myOptions = {
  ...DEFAULT_EXPAND_OPTIONS,
  indent: 2,
  format: 'js'
};

expand('margin: 10px', myOptions);
```

---

## 📂 STEP 7: Remove Zod from package.json

```bash
pnpm remove zod
```

This will:
- Remove `zod` from `dependencies`
- Update `pnpm-lock.yaml`
- Remove from `node_modules`

---

## 📂 STEP 8: Run Tests

```bash
# Type check
pnpm type-check

# Run test suite
pnpm test

# Run with coverage
pnpm test:coverage
```

**Expected result:** All tests pass (no behavior changes)

---

## 📂 STEP 9: Build and Measure

```bash
# Build
pnpm build

# Measure bundle size
pnpm size
```

**Expected output:**
```
ESM (import)
Size:       ~63-67 KB (was 107.76 KB)
Reduction:  ~40 KB (-40%)

CJS (require)  
Size:       ~73-78 KB (was 118.05 KB)
Reduction:  ~40 KB (-40%)
```

---

## 📂 STEP 10: Update Documentation

### Update README.md

**Bundle size badges:**
```markdown
<!-- Before -->
![Bundle Size](https://img.shields.io/badge/bundle-107KB-yellow)

<!-- After -->
![Bundle Size](https://img.shields.io/badge/bundle-63KB-green)
```

**Dependencies section:**
```markdown
## Dependencies

- `css-tree` - CSS parsing and validation
- ~~`zod` - Schema validation and type inference~~ (Removed in v2.4.0)
```

**Add to Features section:**
```markdown
- ⚡ **40% smaller** in v2.4.0 (63 KB vs 107 KB)
```

### Update CHANGELOG.md

```markdown
## [2.4.0] - 2025-XX-XX

### Changed
- **BREAKING:** None - 100% API compatible
- Removed Zod dependency (40% bundle size reduction)
- Replaced Zod schemas with TypeScript interfaces
- Added `DEFAULT_EXPAND_OPTIONS` export for easier option construction

### Bundle Size
- ESM: 107 KB → 63 KB (-40%)
- CJS: 118 KB → 73 KB (-40%)

### Migration Guide
No migration needed - all public APIs remain identical.

Users can now import default options:
\`\`\`typescript
import { expand, DEFAULT_EXPAND_OPTIONS } from 'b_short';

const myOptions = { ...DEFAULT_EXPAND_OPTIONS, indent: 2 };
expand('margin: 10px', myOptions);
\`\`\`
```

---

## ✅ Verification Checklist

Before committing:

- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] All tests pass (`pnpm test`)
- [ ] Bundle size reduced by ~40% (`pnpm size`)
- [ ] `DEFAULT_EXPAND_OPTIONS` exported in index.ts
- [ ] No Zod imports remain in src/
- [ ] No `.parse()` calls remain
- [ ] Documentation updated (README, CHANGELOG)
- [ ] All exported types unchanged (check dist/index.d.ts)

---

## 🎯 Success Criteria

1. ✅ Bundle size: ~63-67 KB ESM (down from 107 KB)
2. ✅ Zero breaking changes (all tests pass)
3. ✅ Same public API (types, functions, constants)
4. ✅ `DEFAULT_EXPAND_OPTIONS` exported (user request)
5. ✅ No Zod dependency
6. ✅ TypeScript still enforces type safety

---

## 🔍 Testing the Change

### Manual Tests

```typescript
// Test 1: Basic expand still works
import { expand } from './src/index';
const result = expand('margin: 10px 20px');
console.assert(result.ok === true);

// Test 2: Options with defaults (user request)
import { expand, DEFAULT_EXPAND_OPTIONS } from './src/index';
const opts = { ...DEFAULT_EXPAND_OPTIONS, indent: 2, format: 'js' as const };
const result = expand('margin: 10px', opts);
console.assert(typeof result.result === 'object');

// Test 3: Validation still works
import { validate } from './src/index';
const validation = validate('margin: 10px;');
console.assert(validation.ok === true);
```

---

## 🐛 Troubleshooting

### Issue: Type errors after removing Zod

**Solution:** Make sure all `z.infer<typeof Schema>` are replaced with direct type references.

**Find remaining Zod usage:**
```bash
grep -r "z\." src/ --include="*.ts"
grep -r "from.*zod" src/ --include="*.ts"
```

### Issue: Tests fail

**Most likely:** You missed updating a `.parse()` call or schema reference.

**Check:**
```bash
grep -r "\.parse(" src/ --include="*.ts" | grep -v "csstree\|JSON\|parseInt"
```

### Issue: Bundle size didn't decrease

**Check:** Zod is still in dependencies
```bash
grep "zod" package.json
```

**Fix:** `pnpm remove zod` and rebuild

---

## 📊 Expected File Changes

```
Modified files:
  src/core/schema.ts          (~400 → ~300 lines, -Zod +TypeScript)
  src/core/validate.ts         (Remove 1 .parse() call)
  src/core/expand.ts           (Use DEFAULT_EXPAND_OPTIONS)
  src/internal/property-handler.ts  (Remove 2 .parse() calls)
  src/index.ts                 (Export DEFAULT_EXPAND_OPTIONS)
  package.json                 (Remove zod dependency)
  pnpm-lock.yaml              (Auto-updated)
  README.md                    (Bundle size, dependencies)
  CHANGELOG.md                 (Add v2.4.0 entry)

No changes to:
  All 50+ property handlers (no Zod usage)
  All internal utilities (no Zod usage)
  Test files (behavior unchanged)
```

---

## 🚀 Release Checklist

- [ ] All tests pass
- [ ] Bundle size verified (~63 KB)
- [ ] CHANGELOG.md updated
- [ ] README.md updated
- [ ] Version bumped to 2.4.0
- [ ] Git commit: "refactor: remove Zod dependency (40% size reduction)"
- [ ] Git tag: `v2.4.0`
- [ ] Push to GitHub
- [ ] Publish to npm: `pnpm publish`

---

**Document created:** 2025-10-28  
**For task:** Remove Zod dependency  
**Expected time:** 2-3 hours  
**Risk level:** Low (no breaking changes)  
**Bundle impact:** -40% (107 KB → 63 KB)
