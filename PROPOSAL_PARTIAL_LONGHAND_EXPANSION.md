# Proposal: Optional Partial Longhand Expansion

**Date:** October 17, 2025  
**Version:** v2.2.0 (proposed)  
**Type:** Feature Enhancement (Non-Breaking)  
**Author:** Code Audit & Enhancement

---

## Executive Summary

This proposal introduces **optional expansion of partial longhand properties** (e.g., `border-top-width`) into their full set of directional longhands with default/initial values. This feature addresses an edge case where users may want to normalize CSS by expanding partial directional properties while maintaining explicit control through an opt-in flag.

---

## Problem Statement

### Current Behavior

When b_short encounters a **longhand property** (e.g., `border-top-width: 1px`), it correctly recognizes this as already expanded and passes it through unchanged:

```javascript
expand("border-top-width: 1px;", { format: 'js' })
// → { borderTopWidth: '1px' }
```

However, when encountering a **directional shorthand** (e.g., `border-width: 1px`), it expands to all four directions:

```javascript
expand("border-width: 1px;", { format: 'js' })
// → { 
//     borderTopWidth: '1px',
//     borderRightWidth: '1px',
//     borderBottomWidth: '1px',
//     borderLeftWidth: '1px'
//   }
```

### The Edge Case

There's an interesting middle ground: **partial longhand properties** that specify only one direction. In certain use cases (CSS normalization, design systems, static analysis), users may want to **optionally expand** these partial properties to show their implicit default values for the other directions.

### Example Scenarios

1. **Design System Tokens**: Normalize all border properties to show complete state
2. **Static Analysis Tools**: Identify which directions are explicitly set vs. using defaults
3. **CSS Preprocessing**: Transform partial properties into complete property sets
4. **Documentation Generation**: Show full property expansion for clarity

---

## Proposed Solution

### Add `expandPartialLonghand` Option

Add a new **optional, opt-in** configuration flag to `ExpandOptions`:

```typescript
interface ExpandOptions {
  format?: 'js' | 'css';
  indent?: number;
  separator?: string;
  propertyGrouping?: 'by-property' | 'by-side';
  
  // NEW: Expand partial longhand properties with defaults
  expandPartialLonghand?: boolean;  // default: false
}
```

### Behavior

#### Default Behavior (Backward Compatible)

```javascript
// expandPartialLonghand: false (default)
expand("border-top-width: 1px;", { format: 'js' })
// → { borderTopWidth: '1px' }
```

#### Opt-In Expansion

```javascript
// expandPartialLonghand: true
expand("border-top-width: 1px;", { format: 'js', expandPartialLonghand: true })
// → {
//     borderTopWidth: '1px',
//     borderRightWidth: 'medium',    // CSS default
//     borderBottomWidth: 'medium',   // CSS default
//     borderLeftWidth: 'medium'      // CSS default
//   }
```

---

## Scope: Properties to Support

### Tier 1: High-Value Properties (Include in v2.2.0)

Based on usage frequency analysis across popular CSS frameworks and real-world codebases, the following properties are recommended for initial implementation:

#### 1. Border Properties (12 properties)

**Width Properties**
- `border-top-width` → expand with defaults for right/bottom/left
- `border-right-width` → expand with defaults for top/bottom/left
- `border-bottom-width` → expand with defaults for top/right/left
- `border-left-width` → expand with defaults for top/right/bottom

Default value: `medium` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width))

**Style Properties**
- `border-top-style` → expand with defaults
- `border-right-style` → expand with defaults
- `border-bottom-style` → expand with defaults
- `border-left-style` → expand with defaults

Default value: `none` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style))

**Color Properties**
- `border-top-color` → expand with defaults
- `border-right-color` → expand with defaults
- `border-bottom-color` → expand with defaults
- `border-left-color` → expand with defaults

Default value: `currentcolor` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color))

#### 2. Margin Properties (4 properties)

- `margin-top` → expand with defaults for right/bottom/left
- `margin-right` → expand with defaults for top/bottom/left
- `margin-bottom` → expand with defaults for top/right/left
- `margin-left` → expand with defaults for top/right/bottom

Default value: `0` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/margin))

**Rationale:** Extremely high usage frequency. Margin is one of the most common CSS properties, and individual directional margins are often set in isolation for vertical rhythm, responsive spacing, and layout adjustments.

#### 3. Padding Properties (4 properties)

- `padding-top` → expand with defaults for right/bottom/left
- `padding-right` → expand with defaults for top/bottom/left
- `padding-bottom` → expand with defaults for top/right/left
- `padding-left` → expand with defaults for top/right/bottom

Default value: `0` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/padding))

**Rationale:** Extremely high usage frequency. Padding is essential for spacing, and directional padding properties are commonly used for buttons, cards, containers, and responsive layouts.

#### 4. Border-Radius Corner Properties (4 properties)

- `border-top-left-radius` → expand with defaults for other corners
- `border-top-right-radius` → expand with defaults for other corners
- `border-bottom-right-radius` → expand with defaults for other corners
- `border-bottom-left-radius` → expand with defaults for other corners

Default value: `0` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius))

**Rationale:** Very common in modern UI design. Individual corner radii are frequently used for tabs, tooltips, cards with specific rounded corners, and design system components.

**Total for Tier 1:** 24 properties

### Tier 2: Medium-Value Properties (Consider for v2.3.0)

These properties have moderate usage but add value for specific use cases:

#### Inset/Positioning Properties (4 properties)

- `top` → expand with defaults for right/bottom/left
- `right` → expand with defaults for top/bottom/left
- `bottom` → expand with defaults for top/right/left
- `left` → expand with defaults for top/right/bottom

Default value: `auto` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/inset))

**Rationale:** Common in positioned elements (absolute, fixed, sticky). Less frequent than margin/padding but still valuable for layout systems.

#### Scroll-Margin Properties (4 properties)

- `scroll-margin-top` → expand with defaults
- `scroll-margin-right` → expand with defaults
- `scroll-margin-bottom` → expand with defaults
- `scroll-margin-left` → expand with defaults

Default value: `0` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin))

**Rationale:** Growing usage with scroll snap APIs and modern scrolling UX patterns.

#### Scroll-Padding Properties (4 properties)

- `scroll-padding-top` → expand with defaults
- `scroll-padding-right` → expand with defaults
- `scroll-padding-bottom` → expand with defaults
- `scroll-padding-left` → expand with defaults

Default value: `auto` ([CSS Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding))

**Rationale:** Growing usage with scroll snap containers and scrolling interfaces.

**Total for Tier 2:** 12 properties

### Properties NOT Recommended

- **overflow-x/y**: Already handled as shorthand in b_short
- **border-image-***: Too complex with multiple sub-properties, rare usage
- **background-position-x/y**: Rarely used individually, complex interaction with background shorthand

---

## Default Values by Property Type

### Border Properties
- **border-width**: `medium` (approximately 3px, browser-dependent) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)
- **border-style**: `none` (no border displayed) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style)
- **border-color**: `currentcolor` (inherits from color property) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color)

### Spacing Properties
- **margin**: `0` (no external spacing) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)
- **padding**: `0` (no internal spacing) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)

### Corner Properties
- **border-radius**: `0` (square corners) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)

### Positioning Properties (Tier 2)
- **inset (top/right/bottom/left)**: `auto` (no offset positioning) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset)

### Scroll Properties (Tier 2)
- **scroll-margin**: `0` (no scroll margin) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin)
- **scroll-padding**: `auto` (browser default) - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding)

---

## Implementation Strategy

### 1. Create Partial Longhand Detector

```typescript
// src/partial-longhand.ts

interface PartialLonghandConfig {
  pattern: RegExp;
  sides: string[];
  defaults: Record<string, string>;
}

const BORDER_WIDTH_CONFIG: PartialLonghandConfig = {
  pattern: /^border-(top|right|bottom|left)-width$/,
  sides: ['top', 'right', 'bottom', 'left'],
  defaults: {
    top: 'medium',
    right: 'medium',
    bottom: 'medium',
    left: 'medium'
  }
};

const BORDER_STYLE_CONFIG: PartialLonghandConfig = {
  pattern: /^border-(top|right|bottom|left)-style$/,
  sides: ['top', 'right', 'bottom', 'left'],
  defaults: {
    top: 'none',
    right: 'none',
    bottom: 'none',
    left: 'none'
  }
};

const BORDER_COLOR_CONFIG: PartialLonghandConfig = {
  pattern: /^border-(top|right|bottom|left)-color$/,
  sides: ['top', 'right', 'bottom', 'left'],
  defaults: {
    top: 'currentcolor',
    right: 'currentcolor',
    bottom: 'currentcolor',
    left: 'currentcolor'
  }
};

// Map property to its expansion configuration
const PARTIAL_LONGHAND_MAP: Record<string, PartialLonghandConfig> = {
  'border-top-width': BORDER_WIDTH_CONFIG,
  'border-right-width': BORDER_WIDTH_CONFIG,
  'border-bottom-width': BORDER_WIDTH_CONFIG,
  'border-left-width': BORDER_WIDTH_CONFIG,
  'border-top-style': BORDER_STYLE_CONFIG,
  'border-right-style': BORDER_STYLE_CONFIG,
  'border-bottom-style': BORDER_STYLE_CONFIG,
  'border-left-style': BORDER_STYLE_CONFIG,
  'border-top-color': BORDER_COLOR_CONFIG,
  'border-right-color': BORDER_COLOR_CONFIG,
  'border-bottom-color': BORDER_COLOR_CONFIG,
  'border-left-color': BORDER_COLOR_CONFIG,
};

/**
 * Expands a partial longhand property with defaults for other directions.
 * 
 * @param property - CSS property name (e.g., 'border-top-width')
 * @param value - CSS property value (e.g., '1px')
 * @returns Expanded properties with defaults, or undefined if not a partial longhand
 */
export function expandPartialLonghand(
  property: string, 
  value: string
): Record<string, string> | undefined {
  const config = PARTIAL_LONGHAND_MAP[property];
  if (!config) return undefined;

  // Extract the side from the property name
  const match = property.match(config.pattern);
  if (!match) return undefined;
  
  const specifiedSide = match[1];
  const propertyType = property.split('-').pop(); // 'width', 'style', or 'color'
  
  // Build result with specified value and defaults
  const result: Record<string, string> = {};
  
  for (const side of config.sides) {
    const propName = `border-${side}-${propertyType}`;
    result[propName] = side === specifiedSide ? value : config.defaults[side];
  }
  
  return result;
}
```

### 2. Integrate into Main expand() Function

```typescript
// src/index.ts (modifications)

function expand(input: string, options: Partial<ExpandOptions> = {}): ExpandResult {
  // ... existing code ...
  
  const {
    format = "css",
    indent = 0,
    separator = "\n",
    propertyGrouping = "by-property",
    expandPartialLonghand = false,  // NEW
  } = options;
  
  // ... existing parsing code ...
  
  for (const item of inputs) {
    const parsed = parseCssDeclaration(item);
    if (!parsed) continue;
    
    const { property, value } = parsed;
    const normalized = value.trim();
    
    // ... existing !important handling ...
    
    const parse = shorthand[property];
    const longhand = parse?.(normalized);
    
    if (!longhand) {
      // NEW: Check if this is a partial longhand property
      if (expandPartialLonghand) {
        const expanded = expandPartialLonghand(property, normalized);
        if (expanded) {
          results.push(expanded);
          resultMetadata.push({ 
            isShorthand: true, 
            properties: new Set(Object.keys(expanded)) 
          });
          continue;
        }
      }
      
      // Existing non-shorthand handling
      const result: Record<string, string> = {};
      result[property] = normalized;
      results.push(result);
      resultMetadata.push({ isShorthand: false, properties: new Set([property]) });
      continue;
    }
    
    // ... existing shorthand expansion ...
  }
  
  // ... rest of function ...
}
```

### 3. Update Schema

```typescript
// src/schema.ts

export const ExpandOptionsSchema = z
  .object({
    format: z.enum(["js", "css"]).default("css").optional(),
    indent: z.number().min(0).default(0).optional(),
    separator: z.string().default("\n").optional(),
    propertyGrouping: z.enum(["by-property", "by-side"]).default("by-property").optional(),
    expandPartialLonghand: z.boolean().default(false).optional()
      .describe("Expand partial longhand properties (e.g., border-top-width) with defaults for other directions"),
  })
  .describe("Options for CSS expansion");
```

---

## Test Cases

### Test File: `test/partial-longhand.test.ts`

```typescript
import { describe, expect, it } from 'vitest';
import { expand } from '../src/index';

describe('Partial Longhand Expansion', () => {
  describe('Border Width', () => {
    it('should not expand by default (backward compatible)', () => {
      const result = expand('border-top-width: 1px;', { format: 'js' });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ borderTopWidth: '1px' });
    });

    it('should expand border-top-width when enabled', () => {
      const result = expand('border-top-width: 1px;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: '1px',
        borderRightWidth: 'medium',
        borderBottomWidth: 'medium',
        borderLeftWidth: 'medium',
      });
    });

    it('should expand border-right-width when enabled', () => {
      const result = expand('border-right-width: 2em;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: 'medium',
        borderRightWidth: '2em',
        borderBottomWidth: 'medium',
        borderLeftWidth: 'medium',
      });
    });

    it('should expand border-bottom-width when enabled', () => {
      const result = expand('border-bottom-width: thick;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: 'medium',
        borderRightWidth: 'medium',
        borderBottomWidth: 'thick',
        borderLeftWidth: 'medium',
      });
    });

    it('should expand border-left-width when enabled', () => {
      const result = expand('border-left-width: 0;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: 'medium',
        borderRightWidth: 'medium',
        borderBottomWidth: 'medium',
        borderLeftWidth: '0',
      });
    });
  });

  describe('Border Style', () => {
    it('should expand border-top-style when enabled', () => {
      const result = expand('border-top-style: solid;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: 'solid',
        borderRightStyle: 'none',
        borderBottomStyle: 'none',
        borderLeftStyle: 'none',
      });
    });

    it('should expand border-right-style when enabled', () => {
      const result = expand('border-right-style: dashed;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: 'none',
        borderRightStyle: 'dashed',
        borderBottomStyle: 'none',
        borderLeftStyle: 'none',
      });
    });
  });

  describe('Border Color', () => {
    it('should expand border-top-color when enabled', () => {
      const result = expand('border-top-color: red;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopColor: 'red',
        borderRightColor: 'currentcolor',
        borderBottomColor: 'currentcolor',
        borderLeftColor: 'currentcolor',
      });
    });

    it('should expand border-left-color when enabled', () => {
      const result = expand('border-left-color: #ff0;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopColor: 'currentcolor',
        borderRightColor: 'currentcolor',
        borderBottomColor: 'currentcolor',
        borderLeftColor: '#ff0',
      });
    });
  });

  describe('CSS Format Output', () => {
    it('should work with CSS format', () => {
      const result = expand('border-top-width: 1px;', { 
        format: 'css', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toBe(
        'border-top-width: 1px;\n' +
        'border-right-width: medium;\n' +
        'border-bottom-width: medium;\n' +
        'border-left-width: medium;'
      );
    });
  });

  describe('Property Grouping', () => {
    it('should respect by-property grouping', () => {
      const result = expand('border-top-width: 1px;', { 
        format: 'js', 
        expandPartialLonghand: true,
        propertyGrouping: 'by-property'
      });
      expect(result.ok).toBe(true);
      const keys = Object.keys(result.result);
      expect(keys).toEqual([
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
      ]);
    });

    it('should respect by-side grouping', () => {
      const result = expand('border-top-width: 1px;', { 
        format: 'js', 
        expandPartialLonghand: true,
        propertyGrouping: 'by-side'
      });
      expect(result.ok).toBe(true);
      const keys = Object.keys(result.result);
      expect(keys).toEqual([
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
      ]);
    });
  });

  describe('Conflict Resolution', () => {
    it('should handle partial longhand followed by shorthand', () => {
      const result = expand('border-top-width: 5px; border-width: 1px;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      // border-width should override the expanded border-top-width
      expect(result.result).toEqual({
        borderTopWidth: '1px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderLeftWidth: '1px',
      });
    });

    it('should handle shorthand followed by partial longhand', () => {
      const result = expand('border-width: 1px; border-top-width: 5px;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      // Explicit border-top-width should override
      expect(result.result).toEqual({
        borderTopWidth: '5px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderLeftWidth: '1px',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should not affect non-border properties', () => {
      const result = expand('margin-top: 10px;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({ marginTop: '10px' });
    });

    it('should work with inherit keyword', () => {
      const result = expand('border-top-width: inherit;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopWidth: 'inherit',
        borderRightWidth: 'medium',
        borderBottomWidth: 'medium',
        borderLeftWidth: 'medium',
      });
    });

    it('should work with initial keyword', () => {
      const result = expand('border-top-style: initial;', { 
        format: 'js', 
        expandPartialLonghand: true 
      });
      expect(result.ok).toBe(true);
      expect(result.result).toEqual({
        borderTopStyle: 'initial',
        borderRightStyle: 'none',
        borderBottomStyle: 'none',
        borderLeftStyle: 'none',
      });
    });
  });
});
```

---

## Documentation Updates

### README.md Addition

Add a new section under "Features" or "Advanced Usage":

```markdown
### Partial Longhand Expansion

By default, b_short passes through longhand properties unchanged. However, you can optionally expand partial directional longhand properties (like `border-top-width`) to show their implicit defaults for other directions:

```typescript
import { expand } from 'b_short';

// Default behavior: pass through unchanged
expand('border-top-width: 1px;', { format: 'js' })
// → { borderTopWidth: '1px' }

// With partial expansion enabled
expand('border-top-width: 1px;', { format: 'js', expandPartialLonghand: true })
// → {
//     borderTopWidth: '1px',
//     borderRightWidth: 'medium',  // CSS default
//     borderBottomWidth: 'medium', // CSS default
//     borderLeftWidth: 'medium'    // CSS default
//   }
```

**Supported Properties:**
- Border width: `border-{top|right|bottom|left}-width` → default: `medium`
- Border style: `border-{top|right|bottom|left}-style` → default: `none`
- Border color: `border-{top|right|bottom|left}-color` → default: `currentcolor`

**Use Cases:**
- CSS normalization and standardization
- Design system token generation
- Static analysis and documentation tools
- Debugging incomplete border declarations
```

---

## Breaking Changes

**None.** This is a **non-breaking addition**:

- New optional parameter defaults to `false`
- Existing behavior preserved when flag is not provided
- Backward compatible with all existing code

---

## Performance Considerations

### Impact Analysis

1. **No impact when disabled** (default): The check is a simple property lookup
2. **Minimal impact when enabled**: 
   - Single regex match per property
   - Map lookup: O(1)
   - Object creation: 4 properties per expansion
3. **Caching opportunity**: Expansion results could be cached if needed

### Benchmark Addition

Add benchmark test to `benchmarks/expand.bench.ts`:

```typescript
bench('Partial longhand expansion (border-top-width)', () => {
  expand('border-top-width: 1px;', { expandPartialLonghand: true });
});
```

Expected performance: Similar to existing shorthand expansions (~100k+ ops/sec).

---

## Migration Path

No migration needed - this is an opt-in feature. Users can adopt gradually:

```typescript
// Phase 1: Use default behavior
const result1 = expand('border-top-width: 1px;');

// Phase 2: Enable for specific use cases
const result2 = expand('border-top-width: 1px;', { 
  expandPartialLonghand: true 
});
```

---

## Alternatives Considered

### Alternative 1: Always Expand (No Flag)

**Rejected:** Would be a breaking change affecting existing users who expect longhand properties to pass through unchanged.

### Alternative 2: Separate Function

Create `expandPartialLonghand()` as a separate exported function.

**Rejected:** Less ergonomic, requires additional processing step, breaks the unified API design.

### Alternative 3: Auto-Detect Based on Context

Automatically expand when other related properties are present.

**Rejected:** Too magical, unpredictable behavior, harder to debug.

---

## Success Metrics

1. **Backward Compatibility**: All existing 750 tests pass without modification
2. **New Test Coverage**: 15+ new test cases covering edge cases
3. **Performance**: No regression in default mode, <5% overhead when enabled
4. **Documentation**: Clear examples and use cases documented
5. **User Adoption**: Positive feedback from design systems and tooling use cases

---

## Timeline

### Phase 1: Implementation (1-2 weeks)
- [ ] Create `src/partial-longhand.ts`
- [ ] Integrate into `src/index.ts`
- [ ] Update `src/schema.ts`
- [ ] Write comprehensive tests

### Phase 2: Documentation (3-5 days)
- [ ] Update README.md
- [ ] Update API documentation
- [ ] Add use case examples
- [ ] Update CHANGELOG.md

### Phase 3: Review & Release (1 week)
- [ ] Code review
- [ ] Performance benchmarking
- [ ] User feedback (if applicable)
- [ ] Release as v2.2.0

---

## Open Questions

1. **Should we support other directional properties beyond borders?**
   - Initial recommendation: No, start with borders only
   - Re-evaluate based on user demand

2. **Should we allow custom defaults?**
   ```typescript
   expandPartialLonghand: {
     enabled: true,
     defaults: {
       'border-width': 'thin'  // Override default 'medium'
     }
   }
   ```
   - Initial recommendation: No, use CSS spec defaults
   - Can add in future version if needed

3. **Should we add a warning when expanding partial properties?**
   - Initial recommendation: No, user explicitly opted in
   - Could add `verbose` mode in future

---

## Conclusion

This proposal adds a valuable feature for CSS normalization and tooling use cases while maintaining 100% backward compatibility. The implementation is straightforward, well-scoped, and aligns with b_short's goal of being a comprehensive CSS shorthand expansion library.

**Recommendation:** Proceed with implementation targeting v2.2.0 release.
