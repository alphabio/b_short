# Deep Dive: How Expand Handles Invalid Values

**Date:** 2025-11-03

## Summary

The `expand()` function **correctly handles invalid CSS values** by keeping the original shorthand property and reporting an "expansion-failed" issue. The validation happens at the handler level, where each property handler validates values according to CSS specifications.

---

## Test Results

### Test 1: Invalid Value (String Input)

```javascript
expand("overflow: xyz auto;")
```

**Result:**

```json
{
  "ok": true,
  "result": "overflow: xyz auto;",
  "issues": [
    {
      "property": "overflow",
      "name": "SyntaxMatchError",
      "syntax": "[ visible | hidden | clip | scroll | auto ]{1,2} | <-non-standard-overflow>",
      "formattedWarning": "Errors found in: overflow\n   1 |overflow: xyz auto;\n      ----------^^^"
    },
    {
      "property": "overflow",
      "name": "expansion-failed",
      "formattedWarning": "Could not expand shorthand property 'overflow' with value 'xyz auto'. Returning original shorthand."
    }
  ]
}
```

**Behavior:**

- Original shorthand preserved: `"overflow: xyz auto;"`
- Two issues reported: SyntaxMatchError + expansion-failed
- `ok: true` (non-fatal error)

### Test 2: Valid Value (String Input)

```javascript
expand("overflow: hidden auto;")
```

**Result:**

```json
{
  "ok": true,
  "result": "overflow-x: hidden;\noverflow-y: auto;",
  "issues": []
}
```

**Behavior:**

- Successfully expanded to longhands
- No issues

### Test 3: Object Input (Unsupported)

```javascript
expand({ overflow: "xyz auto" })
```

**Result:**

```json
{
  "ok": true,
  "result": undefined,
  "issues": []
}
```

**Behavior:**

- Object is coerced to `"[object Object]"` string
- No valid CSS declarations found
- Returns `undefined` result (not an error, just empty)

**Note:** `expand()` only accepts string input. Object input is a TypeScript type issue.

---

## How It Works: Code Flow

### 1. Entry Point (`src/core/expand.ts`)

```typescript
export function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  const cleanedInput = stripComments(input);
  const validation = validate(cleanedInput);
  const inputs = parseInputString(cleanedInput);

  for (const item of inputs) {
    const parsed = parseCssDeclaration(item);
    const { property, value } = parsed;

    // Call handler
    const parse = shorthand[property];
    const longhand = parse?.(value);

    if (!longhand) {
      // Handler returned undefined - validation failed!
      const result: Record<string, string> = {};
      result[property] = value;  // Keep original shorthand
      results.push(result);

      if (property in shorthand) {
        issues.push({
          property,
          name: "expansion-failed",
          formattedWarning: `Could not expand shorthand property '${property}' with value '${value}'. Returning original shorthand.`,
        });
      }
      continue;
    }

    // Handler succeeded - use expanded longhands
    results.push(longhand);
  }
}
```

### 2. Handler Validation (`src/handlers/overflow/expand.ts`)

```typescript
export const overflowHandler: PropertyHandler = createPropertyHandler({
  expand: (value: string): Record<string, string> | undefined => {
    // Global keywords always valid
    if (/^(inherit|initial|unset|revert)$/i.test(value)) {
      return {
        "overflow-x": value,
        "overflow-y": value,
      };
    }

    const values = value.trim().split(/\s+/);

    // Too many values
    if (values.length > 2) {
      return undefined;  // VALIDATION FAILED
    }

    // Valid overflow values per CSS spec
    const validValues = /^(visible|hidden|clip|scroll|auto)$/i;

    // Single value
    if (values.length === 1) {
      if (!validValues.test(values[0])) {
        return undefined;  // VALIDATION FAILED
      }
      return {
        "overflow-x": values[0],
        "overflow-y": values[0],
      };
    }

    // Two values
    if (values.length === 2) {
      if (!validValues.test(values[0]) || !validValues.test(values[1])) {
        return undefined;  // VALIDATION FAILED
      }
      return {
        "overflow-x": values[0],
        "overflow-y": values[1],
      };
    }

    return undefined;
  },

  validate: (value: string): boolean => {
    return overflowHandler.expand(value) !== undefined;
  },
});
```

### 3. Validation Layer (`src/core/validate.ts`)

The `validate()` function is also called and provides CSS-tree based validation:

```javascript
const validation = validate(cleanedInput);
```

This adds additional validation issues like `SyntaxMatchError` using the css-tree parser.

---

## Key Principles

### 1. **Defensive Programming**

Each handler validates inputs according to CSS specifications:

- Regex patterns for valid values
- Length/dimension validation
- Function syntax validation
- Type checking

### 2. **Fail-Safe Behavior**

When validation fails:

- Return `undefined` from handler
- Keep original shorthand property
- Report helpful issues
- `ok: true` (non-fatal)

### 3. **Two-Layer Validation**

1. **CSS-tree validation** (`validate()`) - Syntax errors
2. **Handler validation** (`expand()`) - Semantic errors

### 4. **Issue Reporting**

Clear, actionable error messages:

```
"Could not expand shorthand property 'overflow' with value 'xyz auto'.
Returning original shorthand."
```

---

## Validation Examples by Handler

### Simple Handlers

**overflow:**

```typescript
const validValues = /^(visible|hidden|clip|scroll|auto)$/i;
if (!validValues.test(value)) return undefined;
```

**flex-flow:**

```typescript
const directions = /^(row|row-reverse|column|column-reverse)$/i;
const wraps = /^(nowrap|wrap|wrap-reverse)$/i;
// Validate each token matches one of the patterns
```

### Complex Handlers

**font:**

```typescript
// Order-dependent: [style] [variant] [weight] [stretch] size[/line-height] family
// Complex validation of order and value types
if (!isLength(size) && !isAbsoluteSizeKeyword(size)) return undefined;
```

**grid:**

```typescript
// Multiple forms, template areas with ASCII art
// Extensive validation of template syntax and values
```

**background:**

```typescript
// Multi-layer, 8 longhands + color
// css-tree based parsing with node type validation
```

---

## Invalid Value Handling Summary

| Scenario | Behavior | Result | Issues |
|----------|----------|---------|--------|
| Valid shorthand | Expand to longhands | Expanded longhands | None |
| Invalid shorthand | Keep original | Original shorthand | expansion-failed |
| Non-shorthand property | Pass through | Original property | None |
| Syntax error | Keep original | Original | SyntaxMatchError |
| Empty/missing | Skip | Empty result | None |

---

## Comparison: Expand vs Collapse

| Aspect | Expand | Collapse |
|--------|--------|----------|
| **Validation** | ✅ Yes, per handler | ❌ No validation |
| **Invalid values** | Returns `undefined` | Collapses anyway |
| **Issues reported** | "expansion-failed" | None |
| **Behavior** | Keep original shorthand | Generate invalid shorthand |
| **Safety** | Fail-safe | **Bug!** |

---

## Conclusion

The expand API implements **robust validation** at two levels:

1. **Syntax validation** - css-tree parser catches CSS syntax errors
2. **Semantic validation** - Handlers validate values per CSS specs

When validation fails, expand:

- ✅ Preserves original input (fail-safe)
- ✅ Reports clear issues
- ✅ Continues processing (non-fatal)

**The collapse API should follow the same pattern!**

---

## References

- Issue: `docs.internal/ISSUE-collapse-validation.md`
- Expand source: `src/core/expand.ts`
- Overflow handler: `src/handlers/overflow/expand.ts`
- Validation source: `src/core/validate.ts`
