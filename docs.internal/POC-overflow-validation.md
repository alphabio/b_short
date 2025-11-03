# Proof of Concept: Overflow Collapse with Validation

**Date:** 2025-11-03

## Goal

Demonstrate how to add validation to collapse handlers using the existing `validate()` API.

## Current Implementation (No Validation)

```typescript
// src/handlers/overflow/collapse.ts
export const overflowCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "overflow",
    longhands: ["overflow-x", "overflow-y"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const x = properties["overflow-x"];
    const y = properties["overflow-y"];

    // Both must be present
    if (!x || !y) return undefined;

    // Same value - use single value syntax
    if (x === y) return x;

    // Different values - use two value syntax
    return `${x} ${y}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    return !!(properties["overflow-x"] && properties["overflow-y"]);
  },
});
```

**Problem:** No validation! Will collapse `overflow-x: xyz` even though "xyz" is invalid.

---

## Proposed Implementation (With Validation)

```typescript
// src/handlers/overflow/collapse.ts
import { type CollapseHandler, createCollapseHandler } from "@/internal/collapse-handler";
import { validate } from "@/core/validate";

/**
 * Validates a CSS property value using the validate() API
 * @internal
 */
function isValidValue(property: string, value: string): boolean {
  const css = `${property}: ${value};`;
  const validation = validate(css);
  return validation.warnings.length === 0;
}

export const overflowCollapser: CollapseHandler = createCollapseHandler({
  meta: {
    shorthand: "overflow",
    longhands: ["overflow-x", "overflow-y"],
  },

  collapse(properties: Record<string, string>): string | undefined {
    const x = properties["overflow-x"];
    const y = properties["overflow-y"];

    // Both must be present
    if (!x || !y) return undefined;

    // NEW: Validate both values before collapsing
    if (!isValidValue("overflow-x", x) || !isValidValue("overflow-y", y)) {
      return undefined;  // Don't collapse if invalid
    }

    // Same value - use single value syntax
    if (x === y) return x;

    // Different values - use two value syntax
    return `${x} ${y}`;
  },

  canCollapse(properties: Record<string, string>): boolean {
    const x = properties["overflow-x"];
    const y = properties["overflow-y"];
    
    if (!x || !y) return false;
    
    // NEW: Check if values are valid before allowing collapse
    return isValidValue("overflow-x", x) && isValidValue("overflow-y", y);
  },
});
```

---

## Test Cases

```typescript
import { describe, expect, test } from "vitest";
import { collapse } from "../src";

describe("Overflow collapse with validation", () => {
  test("collapses valid overflow values", () => {
    const result = collapse({
      "overflow-x": "hidden",
      "overflow-y": "auto",
    });
    
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ overflow: "hidden auto" });
    expect(result.issues).toEqual([]);
  });

  test("does not collapse with invalid overflow-x", () => {
    const result = collapse({
      "overflow-x": "xyz",  // Invalid!
      "overflow-y": "auto",
    });
    
    // Should keep longhands uncollapsed
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      "overflow-x": "xyz",
      "overflow-y": "auto",
    });
    expect(result.issues).toEqual([]);
  });

  test("does not collapse with invalid overflow-y", () => {
    const result = collapse({
      "overflow-x": "hidden",
      "overflow-y": "invalid",  // Invalid!
    });
    
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      "overflow-x": "hidden",
      "overflow-y": "invalid",
    });
    expect(result.issues).toEqual([]);
  });

  test("does not collapse with both values invalid", () => {
    const result = collapse({
      "overflow-x": "bad1",
      "overflow-y": "bad2",
    });
    
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({
      "overflow-x": "bad1",
      "overflow-y": "bad2",
    });
    expect(result.issues).toEqual([]);
  });

  test("collapses when both values are same and valid", () => {
    const result = collapse({
      "overflow-x": "scroll",
      "overflow-y": "scroll",
    });
    
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ overflow: "scroll" });
    expect(result.issues).toEqual([]);
  });
});
```

---

## Performance Considerations

### Overhead

Each validation call:
1. Constructs a CSS string: `"overflow-x: xyz;"`
2. Parses with css-tree
3. Validates with css-tree lexer
4. Checks for warnings

### Optimization Options

**Option A: Validation utility (inline)**
```typescript
function isValidValue(property: string, value: string): boolean {
  const validation = validate(`${property}: ${value};`);
  return validation.warnings.length === 0;
}
```

**Option B: Shared validation regex (faster)**
```typescript
// overflow/constants.ts
export const VALID_OVERFLOW_VALUES = /^(visible|hidden|clip|scroll|auto)$/i;

function isValidOverflowValue(value: string): boolean {
  return VALID_OVERFLOW_VALUES.test(value);
}
```

**Option C: Hybrid approach**
```typescript
// Fast path: Check with regex first
if (!VALID_OVERFLOW_VALUES.test(x)) return undefined;

// For complex properties, fall back to validate()
const validation = validate(`${property}: ${value};`);
return validation.warnings.length === 0;
```

### Recommendation

- **Simple properties** (overflow, flex-flow, etc.): Use regex (Option B)
- **Complex properties** (font, grid, background, etc.): Use validate() (Option A)
- **Best of both**: Hybrid approach (Option C) for optimal performance

---

## Rollout Strategy

### Phase 1: Proof of Concept (1 handler)
1. Implement for `overflow` handler
2. Add comprehensive tests
3. Measure performance impact
4. Validate behavior matches expectations

### Phase 2: Simple Handlers (10 handlers)
Roll out to simple properties:
- overflow ✅
- flex-flow
- place-content
- place-items
- place-self
- columns
- contain-intrinsic-size
- list-style
- text-emphasis
- text-decoration
- border-radius
- outline
- column-rule

### Phase 3: Grid Handlers (4 handlers)
- grid-column
- grid-row
- grid-area
- gap

### Phase 4: Complex Handlers (12 handlers)
- font
- grid
- flex
- background
- transition
- animation
- mask
- border
- offset

---

## Alternative: Report Issues Instead of Rejecting

Instead of silently not collapsing, we could report validation warnings:

```typescript
collapse(properties: Record<string, string>): string | undefined {
  const x = properties["overflow-x"];
  const y = properties["overflow-y"];

  if (!x || !y) return undefined;

  // Validate and collect issues
  const validationX = validate(`overflow-x: ${x};`);
  const validationY = validate(`overflow-y: ${y};`);
  
  const hasInvalidValues = 
    validationX.warnings.length > 0 || 
    validationY.warnings.length > 0;

  if (hasInvalidValues) {
    // Option 1: Don't collapse (current POC)
    return undefined;
    
    // Option 2: Collapse but report warning (future enhancement)
    // this.issues.push({
    //   property: "overflow",
    //   name: "invalid-values-collapsed",
    //   formattedWarning: "Collapsed overflow with invalid values..."
    // });
  }

  if (x === y) return x;
  return `${x} ${y}`;
}
```

---

## Conclusion

Using `validate()` API provides:
- ✅ Robust validation (already tested)
- ✅ Consistent with expand behavior
- ✅ No duplication of validation logic
- ✅ Future-proof (updates to validate() apply automatically)

Trade-offs:
- ⚠️ Performance overhead (mitigated by regex for simple properties)
- ⚠️ Requires string construction

**Next Step:** Implement and benchmark on overflow handler to validate approach.
