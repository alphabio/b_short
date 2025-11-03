# ADR-002: Add Context Parameter to expand()

**Status:** Proposed  
**Date:** 2025-11-03  
**Deciders:** Architecture Team  

---

## Context and Problem Statement

Currently, `expand()` always assumes the input is a list of CSS declarations. However, CSS can appear in different contexts with different parsing rules:

1. **Declaration** - Single property: `margin: 10px`
2. **Declaration List** - Multiple properties: `margin: 10px; padding: 5px;`
3. **Stylesheet** - Full CSS with selectors: `.class { margin: 10px; }`

**Proposed API:**
```typescript
expand("...", { context: "declaration" | "declarationList" | "stylesheet" })
```

---

## Current Behavior

```typescript
// Currently, expand() handles declaration lists
expand("margin: 10px; padding: 5px;")  // ✅ Works

// Single declaration also works (treated as list of 1)
expand("margin: 10px")  // ✅ Works

// Stylesheets with selectors FAIL
expand(".class { margin: 10px; }")  // ❌ Parsing error
```

---

## Decision Drivers

1. **Flexibility** - Support different CSS input formats
2. **Use Cases** - Different contexts have different needs
3. **Clarity** - Explicit context reduces ambiguity
4. **Extensibility** - Future-proof for additional contexts

---

## Use Cases

### Use Case 1: Declaration (Single Property)

```typescript
// Input: Single CSS property
expand("margin: 10px", { context: "declaration" })

// Output:
{
  ok: true,
  result: "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;",
  issues: []
}
```

**Why?**
- Validate input is exactly one property
- Clearer intent in code
- Better error messages if multiple properties provided

### Use Case 2: Declaration List (Current Default)

```typescript
// Input: Multiple CSS properties
expand("margin: 10px; padding: 5px;", { context: "declarationList" })

// Output: Same as current behavior
```

**Why?**
- Current default behavior
- Most common use case
- No change needed

### Use Case 3: Stylesheet (NEW!)

```typescript
// Input: Full CSS with selectors
expand(`
  .button {
    margin: 10px 20px;
    background: red url(bg.png);
  }
  
  .input {
    padding: 1rem;
  }
`, { context: "stylesheet" })

// Output:
{
  ok: true,
  result: `
    .button {
      margin-top: 10px;
      margin-right: 20px;
      margin-bottom: 10px;
      margin-left: 20px;
      background-image: url(bg.png);
      background-color: red;
      ...
    }
    
    .input {
      padding-top: 1rem;
      padding-right: 1rem;
      padding-bottom: 1rem;
      padding-left: 1rem;
    }
  `,
  issues: []
}
```

**Why?**
- **HUGE use case** - Transform entire stylesheets!
- CSS-in-JS build tools could use this
- PostCSS plugins could integrate
- Preprocessor workflows

---

## Considered Options

### Option 1: Add Context Parameter (Explicit)

```typescript
expand(input: string, options?: {
  context?: "declaration" | "declarationList" | "stylesheet";
  // ... other options
})
```

**Pros:**
- ✅ Explicit intent
- ✅ Clear error messages
- ✅ Extensible for future contexts
- ✅ Backward compatible (default: "declarationList")

**Cons:**
- ⚠️ More complex API surface
- ⚠️ Users need to understand CSS contexts

### Option 2: Auto-Detect Context

```typescript
// Automatically detect context from input
expand(".class { margin: 10px; }")  // Auto-detects stylesheet
expand("margin: 10px; padding: 5px;")  // Auto-detects declaration list
expand("margin: 10px")  // Auto-detects single declaration
```

**Pros:**
- ✅ Simpler API - no parameter needed
- ✅ "Just works" for users

**Cons:**
- ❌ Magic behavior - less explicit
- ❌ Ambiguous cases: `margin: 10px` (single declaration or list?)
- ❌ Harder to optimize - must parse to detect

### Option 3: Separate Functions

```typescript
expandDeclaration("margin: 10px")
expandDeclarationList("margin: 10px; padding: 5px;")
expandStylesheet(".class { margin: 10px; }")
```

**Pros:**
- ✅ Very explicit
- ✅ Type-safe
- ✅ Clear documentation

**Cons:**
- ❌ API proliferation
- ❌ More functions to maintain
- ❌ Harder to remember which function to use

### Option 4: Keep Simple (Status Quo)

```typescript
// Only support declaration list (current behavior)
expand("margin: 10px; padding: 5px;")
```

**Pros:**
- ✅ Simple API
- ✅ No breaking changes

**Cons:**
- ❌ Can't handle stylesheets
- ❌ Limited use cases
- ❌ No growth path

---

## Decision Outcome

**Chosen option:** Option 1 - Add Context Parameter (Explicit)

### Rationale

1. **Stylesheet support is valuable** - Transforming entire stylesheets opens new use cases
2. **Explicit is better than implicit** - Clear intent in code
3. **Extensible** - Can add new contexts in future
4. **Backward compatible** - Default behavior unchanged

---

## Implementation Design

### API Signature

```typescript
export function expand(
  input: string,
  options?: {
    context?: "declaration" | "declarationList" | "stylesheet";
    format?: "css" | "js";
    indent?: number;
    // ... other options
  }
): ExpandResult;
```

### Default Behavior

```typescript
// Default context is "declarationList" (current behavior)
expand("margin: 10px; padding: 5px;")
// ≡ expand("margin: 10px; padding: 5px;", { context: "declarationList" })
```

### Context Implementations

#### Declaration Context

```typescript
function expandDeclaration(input: string, options: ExpandOptions): ExpandResult {
  // Parse as single declaration
  const parsed = parseCssDeclaration(input);
  
  if (!parsed) {
    return {
      ok: false,
      issues: [{
        name: "parse-error",
        formattedWarning: "Could not parse as single declaration"
      }]
    };
  }
  
  // Validate exactly one property
  const declarations = parseInputString(input);
  if (declarations.length !== 1) {
    return {
      ok: false,
      issues: [{
        name: "context-mismatch",
        formattedWarning: `Expected single declaration, got ${declarations.length}`
      }]
    };
  }
  
  // Expand the single declaration
  return expandDeclarationList(input, options);
}
```

#### Declaration List Context (Current)

```typescript
function expandDeclarationList(input: string, options: ExpandOptions): ExpandResult {
  // Current implementation
  // Parse multiple declarations and expand each
  return currentExpandImplementation(input, options);
}
```

#### Stylesheet Context (NEW!)

```typescript
function expandStylesheet(input: string, options: ExpandOptions): ExpandResult {
  // Parse full stylesheet with css-tree
  const ast = csstree.parse(input, { context: 'stylesheet' });
  
  // Walk AST and expand declarations in each rule
  csstree.walk(ast, {
    visit: 'Declaration',
    enter: (node) => {
      const property = node.property;
      const value = csstree.generate(node.value);
      
      // Check if shorthand
      const handler = shorthand[property];
      if (handler) {
        const expanded = handler(value);
        if (expanded) {
          // Replace declaration with expanded longhands
          // (AST transformation logic)
        }
      }
    }
  });
  
  // Generate CSS from modified AST
  const result = csstree.generate(ast);
  
  return {
    ok: true,
    result,
    issues: []
  };
}
```

### Router Function

```typescript
export function expand(
  input: string,
  options?: Partial<ExpandOptions>
): ExpandResult {
  const context = options?.context ?? "declarationList";
  
  switch (context) {
    case "declaration":
      return expandDeclaration(input, options);
    
    case "declarationList":
      return expandDeclarationList(input, options);
    
    case "stylesheet":
      return expandStylesheet(input, options);
    
    default:
      return {
        ok: false,
        issues: [{
          name: "invalid-context",
          formattedWarning: `Unknown context: ${context}`
        }]
      };
  }
}
```

---

## Examples

### Example 1: Single Declaration

```typescript
expand("margin: 10px", { context: "declaration" })

// Output:
{
  ok: true,
  result: "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;"
}
```

### Example 2: Declaration List (Default)

```typescript
// Both are equivalent
expand("margin: 10px; padding: 5px;")
expand("margin: 10px; padding: 5px;", { context: "declarationList" })

// Output: Current behavior
```

### Example 3: Stylesheet

```typescript
expand(`
  .button {
    margin: 10px 20px;
    padding: 5px;
  }
  
  #header {
    background: blue url(bg.png) center / cover;
  }
`, { context: "stylesheet" })

// Output:
{
  ok: true,
  result: `
    .button {
      margin-top: 10px;
      margin-right: 20px;
      margin-bottom: 10px;
      margin-left: 20px;
      padding-top: 5px;
      padding-right: 5px;
      padding-bottom: 5px;
      padding-left: 5px;
    }
    
    #header {
      background-image: url(bg.png);
      background-position: center;
      background-size: cover;
      background-color: blue;
      background-repeat: repeat;
      background-attachment: scroll;
      background-origin: padding-box;
      background-clip: border-box;
    }
  `
}
```

### Example 4: Context Validation

```typescript
// Error: Multiple declarations in "declaration" context
expand("margin: 10px; padding: 5px;", { context: "declaration" })

// Output:
{
  ok: false,
  issues: [{
    name: "context-mismatch",
    formattedWarning: "Expected single declaration, got 2"
  }]
}
```

---

## Use Cases Unlocked

### Build Tools

```typescript
// PostCSS plugin
const postcssExpand = () => {
  return {
    postcssPlugin: 'expand-shorthands',
    Once(root) {
      const css = root.toString();
      const expanded = expand(css, { context: 'stylesheet' });
      // Replace root with expanded CSS
    }
  };
};
```

### CSS-in-JS

```typescript
// Babel plugin for styled-components
const template = `
  .component {
    ${props => props.styles}
  }
`;

const expanded = expand(template, { context: 'stylesheet' });
```

### Preprocessing

```typescript
// Expand shorthands before Sass/Less compilation
const scss = fs.readFileSync('styles.scss', 'utf8');
const expanded = expand(scss, { context: 'stylesheet' });
fs.writeFileSync('styles.expanded.scss', expanded.result);
```

### Testing

```typescript
// Validate that CSS only uses longhands
test("no shorthand properties in production CSS", () => {
  const expanded = expand(css, { context: 'stylesheet' });
  expect(expanded.result).not.toMatch(/\bmargin:\s/);
  expect(expanded.result).toMatch(/\bmargin-top:\s/);
});
```

---

## Performance Considerations

### Declaration List (Current)
- Fast: Simple string parsing
- ~1ms for 10 declarations

### Stylesheet (New)
- Slower: Full AST parsing + traversal + generation
- ~5-10ms for 100 rules
- **Acceptable** for build-time tools
- **Not ideal** for runtime (but who expands CSS at runtime?)

### Optimization Strategies

1. **Caching** - Cache parsed AST if input hasn't changed
2. **Lazy Parsing** - Only parse what's needed
3. **Streaming** - Process large stylesheets in chunks

---

## Type Definitions

```typescript
// Context enum
export enum ExpandContext {
  DECLARATION = "declaration",
  DECLARATION_LIST = "declarationList", 
  STYLESHEET = "stylesheet"
}

// Options interface
export interface ExpandOptions {
  context?: ExpandContext | "declaration" | "declarationList" | "stylesheet";
  format?: "css" | "js";
  indent?: number;
  separator?: string;
  propertyGrouping?: "by-property" | "by-side";
  expandPartialLonghand?: boolean;
}

// Result type
export interface ExpandResult {
  ok: boolean;
  result?: string;
  issues: BStyleWarning[];
}
```

---

## Testing Strategy

```typescript
describe("expand() with context parameter", () => {
  describe("declaration context", () => {
    test("expands single declaration", () => {
      const result = expand("margin: 10px", { context: "declaration" });
      expect(result.ok).toBe(true);
    });
    
    test("rejects multiple declarations", () => {
      const result = expand("margin: 10px; padding: 5px;", { context: "declaration" });
      expect(result.ok).toBe(false);
      expect(result.issues[0].name).toBe("context-mismatch");
    });
  });
  
  describe("declarationList context", () => {
    test("expands multiple declarations", () => {
      const result = expand("margin: 10px; padding: 5px;", { context: "declarationList" });
      expect(result.ok).toBe(true);
    });
    
    test("is default context", () => {
      const r1 = expand("margin: 10px;");
      const r2 = expand("margin: 10px;", { context: "declarationList" });
      expect(r1).toEqual(r2);
    });
  });
  
  describe("stylesheet context", () => {
    test("expands rules with selectors", () => {
      const result = expand(".class { margin: 10px; }", { context: "stylesheet" });
      expect(result.ok).toBe(true);
      expect(result.result).toContain("margin-top");
      expect(result.result).toContain(".class");
    });
    
    test("handles multiple rules", () => {
      const css = `.a { margin: 10px; } .b { padding: 5px; }`;
      const result = expand(css, { context: "stylesheet" });
      expect(result.ok).toBe(true);
    });
    
    test("handles media queries", () => {
      const css = `@media (min-width: 768px) { .a { margin: 10px; } }`;
      const result = expand(css, { context: "stylesheet" });
      expect(result.ok).toBe(true);
    });
  });
});
```

---

## Consequences

### Positive

- ✅ **Stylesheet Support** - Opens major new use cases
- ✅ **Explicit Intent** - Code is clearer
- ✅ **Build Tool Integration** - PostCSS, Babel plugins possible
- ✅ **Extensible** - Can add new contexts later
- ✅ **Validation** - Can validate input matches context

### Negative

- ⚠️ **Complexity** - More code paths to maintain
- ⚠️ **Performance** - Stylesheet parsing is slower
- ⚠️ **Testing** - Need comprehensive tests for each context
- ⚠️ **Documentation** - Need to explain contexts

### Neutral

- 📝 **Backward Compatible** - Default behavior unchanged
- 📝 **Optional** - Users can ignore if not needed

---

## Alternatives Considered

### Alternative: Separate Package

```typescript
// Keep b_short simple, create b_short-stylesheet
import { expandStylesheet } from 'b_short-stylesheet';
```

**Rejected:** Too much fragmentation, harder to discover

### Alternative: Plugin System

```typescript
import { expand, stylesheetPlugin } from 'b_short';
expand.use(stylesheetPlugin);
```

**Rejected:** Over-engineered for this use case

---

## Migration Path

### Phase 1: Add Context Support (v2.6.0)
- Implement declaration, declarationList, stylesheet contexts
- Default: declarationList (no breaking changes)
- Add tests and documentation

### Phase 2: Promote Usage (v2.7.0)
- Add examples to README
- Create guides for build tool integration
- Benchmark and optimize stylesheet context

### Phase 3: Ecosystem (v3.0.0)
- PostCSS plugin
- Babel plugin
- Vite plugin
- Next.js integration

---

## Open Questions

1. **Should we support CSS modules?**
   - `:local(.class)`, `:global(.class)` syntax
   - Answer: Not in v1, can add later

2. **What about @import rules?**
   - Should we resolve and expand imported files?
   - Answer: No, out of scope (build tool responsibility)

3. **Performance acceptable for runtime?**
   - Is stylesheet parsing fast enough for SSR?
   - Answer: Needs benchmarking, but probably build-time only

4. **Error handling in stylesheet context?**
   - Skip invalid rules or fail entire stylesheet?
   - Answer: Skip invalid, report as issues

---

## References

- [css-tree AST](https://github.com/csstree/csstree)
- [PostCSS Plugin API](https://postcss.org/api/)
- [CSS Syntax Spec](https://drafts.csswg.org/css-syntax-3/)

---

## Related ADRs

- ADR-001: Add Object Input Support to expand()
- ADR-003: Validation Strategy for collapse()

---

**Decision:** Approved pending prototype
**Next Steps:** 
1. Prototype stylesheet context
2. Benchmark performance
3. Gather feedback on API

---

## Thoughts & Discussion

**Key Insight:** The `context: "stylesheet"` option is a **game-changer**. It transforms b_short from a "utility function" to a "build tool component."

**Question for Review:** Should stylesheet context be in core or separate package?
- **Core:** More discoverable, easier to use
- **Separate:** Keeps core light, opt-in for advanced use cases

**Recommendation:** Start in core, can extract later if bundle size becomes issue.
