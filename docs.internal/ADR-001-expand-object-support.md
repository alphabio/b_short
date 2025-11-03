# ADR-001: Add Object Input Support to expand()

**Status:** Proposed  
**Date:** 2025-11-03  
**Deciders:** Architecture Team  

---

## Context and Problem Statement

Currently, `expand()` only accepts CSS string input, while `collapse()` accepts both objects and strings. This creates API asymmetry and limits developer experience in JavaScript-first workflows.

**Current Behavior:**
```typescript
// Works
expand("margin: 10px 20px;")  // ✅

// Silently fails (coerced to "[object Object]")
expand({ margin: "10px 20px" })  // ❌ Returns undefined

// Works
collapse({ "margin-top": "10px", ... })  // ✅
```

**User Request:** Add object input support to `expand()` for API symmetry and better JavaScript integration.

---

## Decision Drivers

1. **API Consistency** - Both expand and collapse should accept similar input types
2. **Developer Experience** - JavaScript-first developers work with objects, not strings
3. **Type Safety** - TypeScript can validate object property names
4. **Framework Integration** - Better support for React, Vue, styled-components workflows
5. **Backward Compatibility** - Must not break existing string-based usage

---

## Considered Options

### Option 1: Add Object Support with Type Inference

```typescript
// Overloaded function signatures
function expand(input: string, options?: ExpandOptions): ExpandResult<string>;
function expand(input: CSSProperties, options?: ExpandOptions): ExpandResult<CSSProperties>;
function expand(input: CSSPropertiesHyphenated, options?: ExpandOptions): ExpandResult<CSSPropertiesHyphenated>;
```

**Pros:**
- ✅ Type-safe property names
- ✅ Output format matches input format (object → object)
- ✅ Clean API - no ambiguity about output type

**Cons:**
- ⚠️ Requires defining comprehensive type interfaces
- ⚠️ More complex implementation

### Option 2: Add Object Support with Format Option

```typescript
expand({ margin: "10px" }, { format: "js" })
// → { marginTop: "10px", ... }

expand({ margin: "10px" }, { format: "css" })
// → "margin-top: 10px; ..."
```

**Pros:**
- ✅ Explicit output format control
- ✅ Flexible for different use cases

**Cons:**
- ❌ Ambiguous - why would object input produce string output?
- ❌ Breaks "input type = output type" pattern

### Option 3: Keep Asymmetry, Document It

```typescript
// expand: String → String
expand("margin: 10px;")

// collapse: Object → Object OR String → String
collapse({ ... })
collapse("...")
```

**Pros:**
- ✅ No breaking changes
- ✅ Clear separation of concerns

**Cons:**
- ❌ API asymmetry confuses users
- ❌ Requires string conversion for object workflows

---

## Decision Outcome

**Chosen option:** Option 1 - Add Object Support with Type Inference

### Rationale

1. **Symmetric API** - Both expand and collapse accept objects and strings
2. **Type Safety** - TypeScript validates property names at compile time
3. **Natural Behavior** - Input type determines output type
4. **Better DX** - No string conversion needed for JS workflows

### Implementation Strategy

#### Phase 1: Type System (Priority)

Define comprehensive CSS property types:

```typescript
// CSS property names (kebab-case)
interface CSSPropertiesHyphenated {
  'margin'?: string;
  'margin-top'?: string;
  'padding'?: string;
  'background'?: string;
  // ... all CSS properties
}

// CSS property names (camelCase for React)
interface CSSPropertiesCamelCase {
  margin?: string;
  marginTop?: string;
  padding?: string;
  background?: string;
  // ... all CSS properties
}

// Union type for flexibility
type CSSProperties = CSSPropertiesHyphenated | CSSPropertiesCamelCase;
```

#### Phase 2: Function Overloads

```typescript
// String input → String output
export function expand(
  input: string, 
  options?: Partial<ExpandOptions>
): ExpandResult<string>;

// Object input (hyphenated) → Object output (hyphenated)
export function expand(
  input: CSSPropertiesHyphenated,
  options?: Partial<ExpandOptions>
): ExpandResult<CSSPropertiesHyphenated>;

// Object input (camelCase) → Object output (camelCase)
export function expand(
  input: CSSPropertiesCamelCase,
  options?: Partial<ExpandOptions>
): ExpandResult<CSSPropertiesCamelCase>;

// Implementation
export function expand(
  input: string | CSSProperties,
  options?: Partial<ExpandOptions>
): ExpandResult<string | CSSProperties> {
  if (typeof input === 'string') {
    return expandString(input, options);
  } else {
    return expandObject(input, options);
  }
}
```

#### Phase 3: Object Expansion Logic

```typescript
function expandObject(
  input: CSSProperties,
  options?: Partial<ExpandOptions>
): ExpandResult<CSSProperties> {
  const result: Record<string, string> = {};
  const issues: BStyleWarning[] = [];
  
  // Detect naming convention (camelCase vs kebab-case)
  const isCamelCase = Object.keys(input).some(k => /[A-Z]/.test(k));
  
  for (const [property, value] of Object.entries(input)) {
    // Normalize property name to kebab-case
    const kebabProperty = isCamelCase 
      ? camelToKebab(property) 
      : property;
    
    // Check if it's a shorthand
    const handler = shorthand[kebabProperty];
    
    if (handler) {
      // Expand shorthand
      const expanded = handler(value);
      
      if (expanded) {
        // Add expanded longhands
        for (const [longhand, longhandValue] of Object.entries(expanded)) {
          const outputProperty = isCamelCase 
            ? kebabToCamel(longhand) 
            : longhand;
          result[outputProperty] = longhandValue;
        }
      } else {
        // Expansion failed - keep original
        result[property] = value;
        issues.push({
          property: kebabProperty,
          name: "expansion-failed",
          formattedWarning: `Could not expand shorthand property '${kebabProperty}' with value '${value}'.`
        });
      }
    } else {
      // Not a shorthand - keep as-is
      result[property] = value;
    }
  }
  
  return {
    ok: true,
    result: result as CSSProperties,
    issues
  };
}
```

#### Phase 4: Result Type

```typescript
// Generic result type
interface ExpandResult<T = string | CSSProperties> {
  ok: boolean;
  result?: T;
  issues: BStyleWarning[];
}
```

---

## Type System Design

### Core Types

```typescript
// Base CSS properties (exhaustive list)
interface CSSPropertiesBase {
  // Box Model
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  // ... ~500+ CSS properties
}

// Naming convention variants
type CSSPropertiesHyphenated = {
  [K in keyof CSSPropertiesBase as KebabCase<K>]: CSSPropertiesBase[K]
};

type CSSPropertiesCamelCase = CSSPropertiesBase;

type CSSProperties = CSSPropertiesHyphenated | CSSPropertiesCamelCase;
```

### Type Generation Strategy

**Option A: Manual (Initial)**
- Define 50-100 most common properties
- Expand incrementally based on usage

**Option B: Generated from CSS Spec**
- Parse MDN/caniuse data
- Generate comprehensive type definitions
- ~500+ properties

**Option C: Use Existing Types**
- Leverage `csstype` package
- Already has comprehensive CSS property types
- Well-maintained by community

**Recommendation:** Start with Option C, extend as needed.

```typescript
import type { Properties as CSSTypeProperties } from 'csstype';

// Extend with our custom types
interface CSSProperties extends CSSTypeProperties {
  // Add custom properties if needed
}
```

---

## Examples

### Example 1: React Inline Styles

```typescript
import { expand } from 'b_short';

const styles = {
  margin: "10px 20px",
  background: "red url(bg.png)",
  border: "1px solid blue"
};

const expanded = expand(styles);
// Result: {
//   marginTop: "10px",
//   marginRight: "20px",
//   marginBottom: "10px",
//   marginLeft: "20px",
//   backgroundImage: "url(bg.png)",
//   backgroundColor: "red",
//   backgroundPosition: "0% 0%",
//   ...
// }

<div style={expanded.result} />
```

### Example 2: CSS-in-JS

```typescript
import styled from 'styled-components';
import { expand } from 'b_short';

const baseStyles = {
  padding: "1rem 2rem",
  border: "2px solid",
  borderRadius: "8px 4px"
};

const Component = styled.div(expand(baseStyles).result);
```

### Example 3: Kebab-case Properties

```typescript
const styles = {
  'margin': "10px",
  'background-color': "red"
};

const expanded = expand(styles);
// Result: {
//   'margin-top': "10px",
//   'margin-right': "10px",
//   'margin-bottom': "10px",
//   'margin-left': "10px",
//   'background-color': "red"
// }
```

### Example 4: Type Safety

```typescript
// TypeScript catches typos
expand({
  margin: "10px",    // ✅ Valid
  marginn: "10px"    // ❌ TypeScript error: Property 'marginn' does not exist
});
```

---

## Consequences

### Positive

- ✅ **API Symmetry** - expand and collapse have consistent interfaces
- ✅ **Better DX** - Native JavaScript object support
- ✅ **Type Safety** - Compile-time validation of property names
- ✅ **Framework Integration** - Seamless React/Vue workflows
- ✅ **No Breaking Changes** - String input still works exactly as before

### Negative

- ⚠️ **Implementation Complexity** - Need to handle two input types
- ⚠️ **Type Maintenance** - CSS property types need to stay updated
- ⚠️ **Bundle Size** - Type definitions may increase bundle size slightly
- ⚠️ **Testing** - Need comprehensive tests for object input path

### Neutral

- 📝 **Documentation** - Need to document both input modes clearly
- 📝 **Migration** - No migration needed (purely additive feature)

---

## Validation

### Success Criteria

1. ✅ Object input produces correct expanded properties
2. ✅ Naming convention (camelCase vs kebab-case) is preserved
3. ✅ Type checking works in TypeScript
4. ✅ Performance is equivalent to string input
5. ✅ All existing tests still pass
6. ✅ New tests cover object input edge cases

### Testing Strategy

```typescript
describe("expand() with object input", () => {
  test("expands camelCase shorthand", () => {
    const result = expand({ margin: "10px 20px" });
    expect(result.result).toEqual({
      marginTop: "10px",
      marginRight: "20px",
      marginBottom: "10px",
      marginLeft: "20px"
    });
  });

  test("expands kebab-case shorthand", () => {
    const result = expand({ "margin": "10px" });
    expect(result.result).toEqual({
      "margin-top": "10px",
      "margin-right": "10px",
      "margin-bottom": "10px",
      "margin-left": "10px"
    });
  });

  test("preserves non-shorthand properties", () => {
    const result = expand({ 
      margin: "10px",
      color: "red"  // Not a shorthand
    });
    expect(result.result).toMatchObject({
      color: "red"
    });
  });

  test("handles expansion failures", () => {
    const result = expand({ margin: "invalid" });
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].name).toBe("expansion-failed");
  });
});
```

---

## Implementation Checklist

### Phase 1: Type System (Week 1)
- [ ] Research and evaluate `csstype` package
- [ ] Define `CSSProperties` interfaces
- [ ] Add type tests
- [ ] Document type usage

### Phase 2: Core Implementation (Week 2)
- [ ] Add function overloads
- [ ] Implement `expandObject()` function
- [ ] Add naming convention detection
- [ ] Handle camelCase ↔ kebab-case conversion

### Phase 3: Testing (Week 3)
- [ ] Add unit tests for object input
- [ ] Add integration tests with real CSS properties
- [ ] Add type tests
- [ ] Performance benchmarks

### Phase 4: Documentation (Week 4)
- [ ] Update README with object examples
- [ ] Add API documentation
- [ ] Create migration guide (none needed, but explain feature)
- [ ] Add TypeScript examples

### Phase 5: Release
- [ ] Update CHANGELOG
- [ ] Version bump (minor: 2.6.0)
- [ ] Publish to npm
- [ ] Announce feature

---

## References

- [csstype package](https://github.com/frenic/csstype)
- [MDN CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [React: Inline Styles](https://react.dev/reference/react-dom/components/common#applying-css-styles)
- Current expand() implementation: `src/core/expand.ts`
- Current collapse() implementation: `src/core/collapse.ts`

---

## Related ADRs

- ADR-002: Add Context Parameter to expand() (proposed)
- ADR-003: Validation Strategy for collapse() (in progress)

---

**Decision:** Approved pending implementation
**Next Steps:** Begin Phase 1 - Type System Design
