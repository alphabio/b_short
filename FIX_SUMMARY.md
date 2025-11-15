# b_short Fix: Recursive background-position Expansion

**Branch:** `develop`
**Commit:** `10000d3`
**Date:** 2025-11-15

---

## Problem

b_short was NOT fully expanding multi-layer `background-position` values to longhands (`-x` and `-y`).

**Example:**

```css
background: url(a.png) center, url(b.png) left top;
```

**Before (BROKEN):**

```css
background-position: center, left top  /* ❌ Still a shorthand! */
```

**After (FIXED):**

```css
background-position-x: center, left   /* ✅ Longhands */
background-position-y: center, top
```

This broke @b/values integration because @b/values ONLY supports longhands.

---

## Root Cause

1. **expand.ts** had an `isMultiLayer` check that SKIPPED recursive expansion for comma-separated values
2. **background-position/expand.ts** only handled single-layer positions

---

## Solution

### 1. Remove Multi-Layer Check (`src/core/expand.ts`)

```diff
- const isMultiLayer = hasTopLevelCommas(val);
- if (nestedParse && !isMultiLayer) {
+ if (nestedParse) {
```

### 2. Add Multi-Layer Support (`src/handlers/background-position/expand.ts`)

```typescript
export function expandBackgroundPosition(value: string): Record<string, string> {
  const layers = splitLayers(value);

  if (layers.length === 1) {
    // Single layer
    const { x, y } = parsePosition(value);
    return {
      "background-position-x": x,
      "background-position-y": y,
    };
  }

  // Multi-layer: split, expand each, rejoin
  const xValues: string[] = [];
  const yValues: string[] = [];

  for (const layer of layers) {
    const { x, y } = parsePosition(layer);
    xValues.push(x);
    yValues.push(y);
  }

  return {
    "background-position-x": xValues.join(", "),
    "background-position-y": yValues.join(", "),
  };
}
```

### 3. Update Tests

- Fixed `test/recursive-expansion.test.ts` expectations
- Fixed `test/invalid-cases.test.ts` expectations

---

## Tests

✅ **All 929 tests passing**

Key tests:

- ✅ Single-layer backgrounds
- ✅ Multi-layer backgrounds
- ✅ Complex gradients with multiple layers
- ✅ Recursive expansion
- ✅ Invalid cases

---

## Breaking Change

**BREAKING CHANGE:** `background-position` now ALWAYS expands to `-x` and `-y`, even in multi-layer backgrounds.

Any code expecting `background-position` as output will need to be updated to expect `-x` and `-y`.

---

## Next Steps

1. ✅ Commit to `develop` branch
2. TODO: Test with @b/values integration
3. TODO: Release as v3.2.0 (breaking change)

---

**Status:** ✅ **COMPLETE** - Ready for integration testing with @b/values
