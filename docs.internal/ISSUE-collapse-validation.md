# Issue: Collapse handlers don't validate values before collapsing

**Priority:** High
**Component:** Collapse API
**Discovered:** 2025-11-03

## Problem

Collapse handlers currently do not validate that longhand property values are valid CSS before collapsing them into shorthand values. This can result in invalid CSS being generated.

## Current Behavior

```javascript
import { collapse } from 'b_short';

const result = collapse({
  "overflow-x": "xyz",  // Invalid value
  "overflow-y": "auto"   // Valid value
});

// Returns: { ok: true, result: { overflow: "xyz auto" }, issues: [] }
// "xyz" is not a valid overflow value!
```

## Expected Behavior

```javascript
// Should return:
{
  ok: true,
  result: {
    "overflow-x": "xyz",  // Keep uncollapsed because invalid
    "overflow-y": "auto"
  },
  issues: []  // Or optionally add a validation warning
}
```

## Root Cause

Collapse handlers (e.g., `overflowCollapser`) only check:
1. If required longhands are present
2. Basic structural logic (e.g., same vs different values)

They **do not** validate that the values themselves are valid CSS per the property's specification.

## Comparison with Expand

The **expand API correctly handles invalid values**:

```javascript
import { expand } from 'b_short';

const result = expand("overflow: xyz auto;");

// Returns:
{
  ok: true,
  result: "overflow: xyz auto;",  // Original shorthand unchanged
  issues: [
    {
      property: "overflow",
      name: "expansion-failed",
      formattedWarning: "Could not expand shorthand property 'overflow'..."
    }
  ]
}
```

### Expand Flow (CORRECT):
1. Calls `overflowHandler.expand("xyz auto")`
2. Handler validates values using regex
3. Returns `undefined` if invalid
4. Keeps original shorthand, adds "expansion-failed" issue

### Collapse Flow (INCORRECT):
1. Checks if `overflow-x` and `overflow-y` exist
2. Directly concatenates values: `"${x} ${y}"`
3. No validation that values are valid CSS

## Important Discovery: validate() Already Detects Invalid Values!

The `validate()` function **already validates CSS values**:

```javascript
import { validate } from 'b_short';

validate(`
  overflow-x: xyz;
  overflow-y: auto;
`);

// Returns:
{
  ok: true,
  errors: [],
  warnings: [
    {
      property: 'overflow-x',
      name: 'SyntaxMatchError',
      syntax: 'visible | hidden | clip | scroll | auto',
      formattedWarning: '...'
    }
  ]
}
```

This means we have a **ready-made validation system** that we can leverage!

## Proposed Solution

### Option 1: Validate before collapse (Quick Fix)

Each collapse handler should validate values before collapsing:

```typescript
// overflow/collapse.ts
export const overflowCollapser: CollapseHandler = createCollapseHandler({
  // ...
  
  collapse(properties: Record<string, string>): string | undefined {
    const x = properties["overflow-x"];
    const y = properties["overflow-y"];

    if (!x || !y) return undefined;
    
    // NEW: Validate values using the expand handler
    const validX = overflowHandler.validate(`overflow: ${x};`);
    const validY = overflowHandler.validate(`overflow: ${y};`);
    
    if (!validX || !validY) {
      return undefined;  // Don't collapse if invalid
    }

    // Existing logic...
    if (x === y) return x;
    return `${x} ${y}`;
  }
});
```

### Option 2: Use validate() API (NEW - Leverages existing validation!)

```typescript
import { validate } from '@/core/validate';

collapse(properties: Record<string, string>): string | undefined {
  const x = properties["overflow-x"];
  const y = properties["overflow-y"];

  if (!x || !y) return undefined;
  
  // Validate using the existing validate() API
  const validationX = validate(`overflow-x: ${x};`);
  const validationY = validate(`overflow-y: ${y};`);
  
  if (validationX.warnings.length > 0 || validationY.warnings.length > 0) {
    return undefined;  // Don't collapse if validation fails
  }

  if (x === y) return x;
  return `${x} ${y}`;
}
```

**Advantages:**
- Reuses existing, robust validation
- Consistent with expand behavior
- No duplication of validation logic
- Already supports all CSS properties

**Disadvantages:**
- Requires string construction for validation
- May have performance impact (needs benchmarking)

### Option 3: Shared validation utilities

Create shared validation functions that both expand and collapse can use:

```typescript
// overflow/validate.ts
export function isValidOverflowValue(value: string): boolean {
  return /^(visible|hidden|clip|scroll|auto)$/i.test(value);
}

// overflow/expand.ts
expand: (value: string) => {
  const values = value.split(/\s+/);
  if (!values.every(isValidOverflowValue)) {
    return undefined;
  }
  // ...
}

// overflow/collapse.ts
collapse: (properties: Record<string, string>) => {
  const x = properties["overflow-x"];
  const y = properties["overflow-y"];
  
  if (!x || !y || !isValidOverflowValue(x) || !isValidOverflowValue(y)) {
    return undefined;
  }
  // ...
}
```

## Impact

**Affected Handlers:** All 26 collapse handlers

This affects every collapse handler because none of them currently validate values:
- Simple handlers: overflow, flex-flow, place-content, etc.
- Complex handlers: font, grid, background, transition, animation
- Newly added: mask, border, offset

## Recommendation

**Implement Option 2** (Use validate() API) - **UPDATED**:

The `validate()` function already provides comprehensive CSS value validation:
- Uses css-tree lexer (same as expand)
- Validates against CSS specifications
- Reports SyntaxMatchError for invalid values
- Already available and tested

Implementation strategy:
1. Update collapse handlers to validate values before collapsing
2. Use `validate()` API for each longhand value
3. Return `undefined` if any validation warnings
4. Optionally report validation issues in collapse result

**Alternative: Option 3** for performance-critical paths:
- Extract validation regexes to shared constants
- Use lightweight validation where performance matters
- Fall back to validate() for complex properties

## Testing Strategy

For each handler, add tests like:

```typescript
test("does not collapse overflow with invalid values", () => {
  const result = collapse({
    "overflow-x": "xyz",
    "overflow-y": "auto",
  });
  
  expect(result.result).toEqual({
    "overflow-x": "xyz",
    "overflow-y": "auto",
  });
});
```

## Related Issues

- None yet (this is the first discovery)

## Discovered By

User testing - asking about expected behavior of invalid value handling

## Next Steps

1. [ ] Decide on solution approach (Option 1, 2, or 3)
2. [ ] Implement validation for overflow handler (proof of concept)
3. [ ] Add tests for invalid value handling
4. [ ] Roll out to all 26 handlers
5. [ ] Update documentation to clarify validation behavior
