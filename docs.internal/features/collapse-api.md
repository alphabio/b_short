# Collapse API Proposal: Long → Short

**Document Type:** Feature Proposal
**Status:** Design Phase
**Priority:** High
**Complexity:** High
**Date:** 2025-10-28
**Author:** Architecture Team

---

## 🎯 Executive Summary

Proposal to add a **`collapse()` API** - the inverse of `expand()` - that intelligently converts CSS longhand properties back into their shorthand equivalents. This feature completes the bidirectional transformation story and enables powerful use cases like CSS optimization, migration tools, and style refactoring.

**Key Benefits:**

- 🔄 Bidirectional transformation (expand ↔ collapse)
- 📦 CSS optimization (reduce bundle size)
- 🎨 Developer productivity (auto-format styles)
- 🔧 Enables powerful tooling (refactoring, linting)

---

## 📋 Table of Contents

1. [Motivation](#-motivation)
2. [Use Cases](#-use-cases)
3. [API Design](#-api-design)
4. [Architecture](#-architecture)
5. [Implementation Strategy](#-implementation-strategy)
6. [Examples](#-examples)
7. [Challenges & Solutions](#-challenges--solutions)
8. [Testing Strategy](#-testing-strategy)
9. [Performance Considerations](#-performance-considerations)
10. [Roadmap](#-roadmap)
11. [Open Questions](#-open-questions)

---

## 💡 Motivation

### Problem Statement

Currently, b_short only supports **one-way transformation** (shorthand → longhand):

```typescript
// ✅ This works
expand('margin: 10px;')
// → { marginTop: '10px', marginRight: '10px', marginBottom: '10px', marginLeft: '10px' }

// ❌ This doesn't exist
collapse('margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px;')
// → Should return: 'margin: 10px;'
```

### Why This Matters

**1. CSS Optimization**

- Reduce bundle sizes by collapsing verbose longhand into concise shorthands
- Improve parsing performance in browsers
- Reduce bytes over the wire

**2. Developer Productivity**

- Auto-format generated CSS (from CSS-in-JS)
- Refactor verbose styles into readable shorthands
- Migrate legacy codebases

**3. Tooling Ecosystem**

- Build linters that suggest shorthand usage
- Create CSS optimizers and minifiers
- Enable style migration tools

**4. Bidirectional Workflows**

- `expand()` for normalization/analysis
- `collapse()` for optimization/output
- Complete transformation cycle

---

## 🎯 Use Cases

### 1. **CSS-in-JS Optimization**

```typescript
// Component generates verbose inline styles
const styles = {
  paddingTop: '10px',
  paddingRight: '20px',
  paddingBottom: '10px',
  paddingLeft: '20px',
};

// Collapse to shorthand for cleaner output
collapse(styles, { format: 'css' });
// → "padding: 10px 20px;"
```

### 2. **Build Tool Integration**

```typescript
// PostCSS plugin: collapse longhands at build time
postcss.plugin('postcss-collapse', () => {
  return (root) => {
    root.walkDecls((decl) => {
      const collapsed = collapse(decl.toString());
      if (collapsed.ok && collapsed.collapsed.length > 1) {
        // Replace multiple longhands with single shorthand
        replaceDeclarations(decl, collapsed.result);
      }
    });
  };
});
```

### 3. **Style Migration Tool**

```typescript
// Migrate verbose legacy CSS to modern shorthands
const legacyCSS = `
  .box {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: red;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: red;
    /* ... 12 border properties */
  }
`;

const modernCSS = collapse(legacyCSS, { strategy: 'aggressive' });
// → ".box { border: 1px solid red; }"
```

### 4. **Linter / Code Quality Tool**

```typescript
// ESLint plugin: suggest shorthand usage
if (hasAllBorderProperties(node)) {
  const shorthand = collapse(node.properties);
  context.report({
    node,
    message: `Use shorthand: ${shorthand.result}`,
    fix: (fixer) => fixer.replaceText(node, shorthand.result),
  });
}
```

### 5. **React DevTools Enhancement**

```typescript
// Show collapsed styles in DevTools for readability
function formatStyles(computedStyles) {
  const collapsed = collapse(computedStyles, { strategy: 'minimal' });
  return collapsed.result; // Easier to read than 100+ longhand props
}
```

---

## 🔧 API Design

### Core Function Signature

```typescript
/**
 * Collapse CSS longhand properties into their shorthand equivalents
 *
 * @param input - CSS string or object with longhand properties
 * @param options - Configuration for collapse behavior
 * @returns Collapse result with success status and collapsed properties
 *
 * @example
 * collapse('margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px;')
 * // → { ok: true, result: 'margin: 10px;', collapsed: ['margin-top', ...], remaining: [] }
 *
 * @example
 * collapse({ borderTopWidth: '1px', borderTopStyle: 'solid' }, { strategy: 'safe' })
 * // → { ok: false, reason: 'incomplete-set', ... } (missing border-top-color)
 */
function collapse(
  input: string | Record<string, string>,
  options?: Partial<CollapseOptions>
): CollapseResult;
```

### Options Schema

```typescript
interface CollapseOptions {
  /**
   * Strategy for collapsing properties
   *
   * - 'safe': Only collapse when all required longhands present (default)
   * - 'aggressive': Use CSS defaults for missing longhands
   * - 'minimal': Prefer shortest valid representation
   *
   * @default 'safe'
   */
  strategy: 'safe' | 'aggressive' | 'minimal';

  /**
   * Which shorthands to consider
   *
   * - 'all': Try all available shorthands (default)
   * - string[]: Only specific shorthands (e.g., ['margin', 'padding'])
   *
   * @default 'all'
   */
  shorthands: 'all' | string[];

  /**
   * Output format
   *
   * - 'css': Returns CSS string with kebab-case
   * - 'js': Returns object with camelCase
   *
   * @default 'css'
   */
  format: 'css' | 'js';

  /**
   * Sort strategy for remaining properties
   *
   * - 'original': Keep original order
   * - 'alphabetical': Sort alphabetically
   * - 'grouped': Group by property type
   *
   * @default 'original'
   */
  sort: 'original' | 'alphabetical' | 'grouped';

  /**
   * Whether to include properties that couldn't be collapsed
   *
   * @default true
   */
  includeRemaining: boolean;
}
```

### Result Schema

```typescript
interface CollapseResult {
  /**
   * Whether collapse was successful
   */
  ok: boolean;

  /**
   * Collapsed CSS (string or object based on format)
   */
  result?: string | Record<string, string>;

  /**
   * List of properties that were collapsed into shorthands
   */
  collapsed: string[];

  /**
   * List of properties that couldn't be collapsed
   */
  remaining: string[];

  /**
   * Statistics about the collapse operation
   */
  stats: {
    originalCount: number;    // Number of input properties
    collapsedCount: number;   // Number of properties after collapse
    savingsPercent: number;   // Percentage reduction
    bytesSaved?: number;      // Approximate bytes saved (CSS format only)
  };

  /**
   * Warnings or issues encountered
   */
  issues: BStyleWarning[];

  /**
   * Reason for failure (if ok === false)
   */
  reason?: 'incomplete-set' | 'conflicting-values' | 'invalid-input';
}
```

---

## 🏗️ Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                      collapse(input, options)                │
└───────────────────────────────┬─────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Parse & Normalize   │
                    │  (kebab-case object)  │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Property Detector   │
                    │  (find collapsible    │
                    │   property groups)    │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Collapse Analyzer   │
                    │  (determine which     │
                    │   groups can collapse)│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Optimizer           │
                    │  (find optimal        │
                    │   collapse sequence)  │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Formatter           │
                    │  (output as CSS       │
                    │   or JS object)       │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   CollapseResult      │
                    └───────────────────────┘
```

### Module Structure

```
src/
├── collapse/
│   ├── index.ts                    # Main collapse() entry point
│   ├── parser.ts                   # Parse input to normalized format
│   ├── detector.ts                 # Detect collapsible property groups
│   ├── analyzer.ts                 # Determine which groups can collapse
│   ├── optimizer.ts                # Find optimal collapse sequence
│   ├── formatter.ts                # Format output
│   │
│   ├── rules/                      # Collapse rules for each shorthand
│   │   ├── index.ts                # Rule registry
│   │   ├── margin-collapse.ts      # Margin collapse logic
│   │   ├── padding-collapse.ts     # Padding collapse logic
│   │   ├── border-collapse.ts      # Border collapse logic
│   │   ├── directional-collapse.ts # Generic directional helper
│   │   └── ...                     # One file per shorthand
│   │
│   ├── strategies/                 # Collapse strategies
│   │   ├── safe-strategy.ts        # Safe mode: all longhands required
│   │   ├── aggressive-strategy.ts  # Aggressive: use defaults
│   │   ├── minimal-strategy.ts     # Minimal: shortest representation
│   │   └── index.ts
│   │
│   └── utils/
│       ├── value-comparator.ts     # Smart value comparison
│       ├── property-graph.ts       # Property relationships
│       └── default-values.ts       # CSS defaults lookup
│
└── shared/                         # Shared between expand & collapse
    ├── handler-interface.ts        # Bidirectional handler interface
    ├── property-metadata.ts        # Property metadata registry
    └── css-defaults.ts             # (existing)
```

---

## 🔨 Implementation Strategy

### Phase 1: Foundation (Week 1-2)

#### 1.1: Bidirectional Handler Interface

Refactor existing handlers to be bidirectional:

```typescript
// src/shared/handler-interface.ts
interface PropertyHandler {
  /**
   * Expand shorthand to longhands (existing)
   */
  expand(value: string): Record<string, string> | undefined;

  /**
   * Collapse longhands to shorthand (new)
   */
  collapse(properties: Record<string, string>): CollapseCandidate | null;

  /**
   * Metadata for introspection
   */
  meta: HandlerMetadata;
}

interface HandlerMetadata {
  shorthand: string;                  // "margin"
  longhands: string[];                // ["margin-top", "margin-right", ...]
  defaults: Record<string, string>;   // Default CSS values
  category: PropertyCategory;
  priority: number;                   // For optimization (lower = try first)
}

interface CollapseCandidate {
  shorthand: string;                  // "margin"
  value: string;                      // "10px 20px"
  longhands: string[];                // Properties being collapsed
  savings: number;                    // Byte savings (for optimization)
  confidence: number;                 // 0-1 confidence score
}
```

#### 1.2: Property Graph

Build a graph of property relationships:

```typescript
// src/collapse/utils/property-graph.ts
interface PropertyNode {
  name: string;
  shorthand?: string;           // Parent shorthand
  siblings: string[];           // Related longhands
  defaults: string;             // CSS default value
  category: PropertyCategory;
}

class PropertyGraph {
  /**
   * Find all properties that can collapse together
   */
  findCollapsibleGroups(properties: string[]): PropertyGroup[] {
    // Group by shorthand prefix
    // Check completeness
    // Return collapsible groups
  }

  /**
   * Get metadata for a property
   */
  getNode(property: string): PropertyNode | undefined {
    // Lookup in registry
  }

  /**
   * Check if a set of properties can collapse
   */
  canCollapse(properties: string[], strategy: CollapseStrategy): boolean {
    // Check based on strategy
  }
}
```

### Phase 2: Core Collapse Logic (Week 3-4)

#### 2.1: Detector

Identify collapsible property groups:

```typescript
// src/collapse/detector.ts
interface PropertyGroup {
  shorthand: string;              // "margin"
  longhands: Map<string, string>; // { "margin-top": "10px", ... }
  complete: boolean;              // All required longhands present?
  uniform: boolean;               // All values identical?
  collapsible: boolean;           // Can be collapsed per strategy?
}

export function detectGroups(
  properties: Record<string, string>,
  strategy: CollapseStrategy
): PropertyGroup[] {
  const groups = new Map<string, PropertyGroup>();

  // Phase 1: Group properties by shorthand
  for (const [prop, value] of Object.entries(properties)) {
    const handler = getHandlerForProperty(prop);
    if (!handler) continue;

    if (!groups.has(handler.meta.shorthand)) {
      groups.set(handler.meta.shorthand, createGroup(handler));
    }

    const group = groups.get(handler.meta.shorthand)!;
    group.longhands.set(prop, value);
  }

  // Phase 2: Analyze each group
  for (const group of groups.values()) {
    analyzeGroup(group, strategy);
  }

  return Array.from(groups.values()).filter(g => g.collapsible);
}
```

#### 2.2: Collapse Rules

Create collapse logic for each shorthand:

```typescript
// src/collapse/rules/margin-collapse.ts
export function collapseMargin(
  properties: Record<string, string>,
  strategy: CollapseStrategy
): CollapseCandidate | null {
  const sides = ['top', 'right', 'bottom', 'left'];
  const values = sides.map(side => properties[`margin-${side}`]);

  // Check completeness
  if (strategy === 'safe' && values.some(v => v === undefined)) {
    return null; // Incomplete set
  }

  // Fill defaults for aggressive mode
  if (strategy === 'aggressive') {
    for (let i = 0; i < values.length; i++) {
      values[i] = values[i] ?? '0';
    }
  }

  // Check for collapsible patterns
  const [top, right, bottom, left] = values;

  // All four sides identical
  if (top === right && right === bottom && bottom === left) {
    return {
      shorthand: 'margin',
      value: top,
      longhands: sides.map(s => `margin-${s}`),
      savings: calculateSavings(4, 1),
      confidence: 1.0,
    };
  }

  // Top/bottom same, left/right same
  if (top === bottom && right === left) {
    return {
      shorthand: 'margin',
      value: `${top} ${right}`,
      longhands: sides.map(s => `margin-${s}`),
      savings: calculateSavings(4, 2),
      confidence: 1.0,
    };
  }

  // Top unique, left/right same
  if (right === left) {
    return {
      shorthand: 'margin',
      value: `${top} ${right} ${bottom}`,
      longhands: sides.map(s => `margin-${s}`),
      savings: calculateSavings(4, 3),
      confidence: 0.9,
    };
  }

  // All different
  return {
    shorthand: 'margin',
    value: `${top} ${right} ${bottom} ${left}`,
    longhands: sides.map(s => `margin-${s}`),
    savings: calculateSavings(4, 4),
    confidence: 0.8,
  };
}
```

#### 2.3: Border Collapse (Complex Example)

```typescript
// src/collapse/rules/border-collapse.ts
export function collapseBorder(
  properties: Record<string, string>,
  strategy: CollapseStrategy
): CollapseCandidate | null {
  const sides = ['top', 'right', 'bottom', 'left'];
  const subProps = ['width', 'style', 'color'];

  // Extract all border properties
  const borderProps: Record<string, Record<string, string>> = {};
  for (const side of sides) {
    borderProps[side] = {};
    for (const subProp of subProps) {
      const key = `border-${side}-${subProp}`;
      borderProps[side][subProp] = properties[key];
    }
  }

  // Check if all sides have same width/style/color
  const allSidesEqual = sides.every(side =>
    subProps.every(prop =>
      borderProps[side][prop] === borderProps[sides[0]][prop]
    )
  );

  if (allSidesEqual) {
    // Can collapse to: border: 1px solid red;
    const { width, style, color } = borderProps.top;
    return {
      shorthand: 'border',
      value: `${width} ${style} ${color}`,
      longhands: sides.flatMap(s => subProps.map(p => `border-${s}-${p}`)),
      savings: calculateSavings(12, 1),
      confidence: 1.0,
    };
  }

  // Check if can collapse per-side
  const candidates: CollapseCandidate[] = [];
  for (const side of sides) {
    const props = borderProps[side];
    if (props.width && props.style && props.color) {
      candidates.push({
        shorthand: `border-${side}`,
        value: `${props.width} ${props.style} ${props.color}`,
        longhands: subProps.map(p => `border-${side}-${p}`),
        savings: calculateSavings(3, 1),
        confidence: 0.9,
      });
    }
  }

  // Return best candidate(s)
  return candidates.length > 0 ? candidates[0] : null;
}
```

### Phase 3: Optimization (Week 5)

#### 3.1: Greedy Optimizer

Find optimal collapse sequence:

```typescript
// src/collapse/optimizer.ts
export function optimize(
  groups: PropertyGroup[],
  strategy: CollapseStrategy
): CollapseCandidate[] {
  // Sort by savings (greedy approach)
  const sorted = groups
    .map(g => g.handler.collapse(g.longhands, strategy))
    .filter(c => c !== null)
    .sort((a, b) => b.savings - a.savings);

  // Apply collapses in order
  const applied: CollapseCandidate[] = [];
  const used = new Set<string>();

  for (const candidate of sorted) {
    // Check if any property already used
    const conflict = candidate.longhands.some(p => used.has(p));
    if (conflict) continue;

    // Apply this collapse
    applied.push(candidate);
    candidate.longhands.forEach(p => used.add(p));
  }

  return applied;
}
```

#### 3.2: Dynamic Programming (Advanced)

For optimal solution (optional enhancement):

```typescript
// src/collapse/optimizer-dp.ts
export function optimizeDP(
  groups: PropertyGroup[]
): CollapseCandidate[] {
  // Build state space
  // Find maximum savings combination
  // Return optimal sequence
  // (More complex but guaranteed optimal)
}
```

### Phase 4: Strategies (Week 6)

#### 4.1: Safe Strategy

```typescript
// src/collapse/strategies/safe-strategy.ts
export const safeStrategy: CollapseStrategy = {
  name: 'safe',

  canCollapse(group: PropertyGroup): boolean {
    // Must have ALL required longhands
    return group.complete && group.longhands.size === group.handler.meta.longhands.length;
  },

  shouldUseDefaults(): boolean {
    return false; // Never use defaults
  },

  minConfidence(): number {
    return 0.95; // Very high confidence required
  },
};
```

#### 4.2: Aggressive Strategy

```typescript
// src/collapse/strategies/aggressive-strategy.ts
export const aggressiveStrategy: CollapseStrategy = {
  name: 'aggressive',

  canCollapse(group: PropertyGroup): boolean {
    // Can collapse even if some longhands missing
    return group.longhands.size >= Math.ceil(group.handler.meta.longhands.length / 2);
  },

  shouldUseDefaults(): boolean {
    return true; // Use CSS defaults for missing values
  },

  minConfidence(): number {
    return 0.7; // Lower confidence acceptable
  },
};
```

#### 4.3: Minimal Strategy

```typescript
// src/collapse/strategies/minimal-strategy.ts
export const minimalStrategy: CollapseStrategy = {
  name: 'minimal',

  canCollapse(group: PropertyGroup): boolean {
    return group.complete;
  },

  shouldUseDefaults(): boolean {
    return true;
  },

  minConfidence(): number {
    return 0.8;
  },

  // Prefer shortest representation
  preferShorter(a: CollapseCandidate, b: CollapseCandidate): number {
    return a.value.length - b.value.length;
  },
};
```

---

## 📚 Examples

### Example 1: Simple Margin Collapse

```typescript
// Input
const input = {
  marginTop: '10px',
  marginRight: '10px',
  marginBottom: '10px',
  marginLeft: '10px',
};

// Collapse
const result = collapse(input, { format: 'css', strategy: 'safe' });

console.log(result);
// {
//   ok: true,
//   result: 'margin: 10px;',
//   collapsed: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
//   remaining: [],
//   stats: {
//     originalCount: 4,
//     collapsedCount: 1,
//     savingsPercent: 75,
//     bytesSaved: 45
//   },
//   issues: []
// }
```

### Example 2: Partial Collapse (Safe Mode)

```typescript
// Input (incomplete margin)
const input = {
  marginTop: '10px',
  marginRight: '20px',
  paddingTop: '5px',
  paddingRight: '5px',
  paddingBottom: '5px',
  paddingLeft: '5px',
};

// Collapse with safe strategy
const result = collapse(input, { format: 'css', strategy: 'safe' });

console.log(result);
// {
//   ok: true,
//   result: 'margin-top: 10px; margin-right: 20px; padding: 5px;',
//   collapsed: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
//   remaining: ['margin-top', 'margin-right'],
//   stats: {
//     originalCount: 6,
//     collapsedCount: 3,
//     savingsPercent: 50,
//   },
//   issues: [{
//     property: 'margin',
//     name: 'incomplete-set',
//     formattedWarning: 'margin properties incomplete, cannot collapse'
//   }]
// }
```

### Example 3: Aggressive Collapse with Defaults

```typescript
// Input (incomplete border)
const input = {
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  // Missing: border-top-color, and all other sides
};

// Collapse with aggressive strategy
const result = collapse(input, { format: 'css', strategy: 'aggressive' });

console.log(result);
// {
//   ok: true,
//   result: 'border-top: 1px solid currentcolor;',
//   collapsed: ['border-top-width', 'border-top-style'],
//   remaining: [],
//   stats: {
//     originalCount: 2,
//     collapsedCount: 1,
//     savingsPercent: 50,
//   },
//   issues: [{
//     property: 'border-top',
//     name: 'defaults-used',
//     formattedWarning: 'Used CSS default for border-top-color: currentcolor'
//   }]
// }
```

### Example 4: Complex Border Collapse

```typescript
// Input (all 12 border properties)
const input = {
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'red',
  borderRightWidth: '1px',
  borderRightStyle: 'solid',
  borderRightColor: 'red',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'red',
  borderLeftWidth: '1px',
  borderLeftStyle: 'solid',
  borderLeftColor: 'red',
};

// Collapse
const result = collapse(input, { format: 'css', strategy: 'safe' });

console.log(result);
// {
//   ok: true,
//   result: 'border: 1px solid red;',
//   collapsed: [all 12 border properties],
//   remaining: [],
//   stats: {
//     originalCount: 12,
//     collapsedCount: 1,
//     savingsPercent: 91.7,
//     bytesSaved: 180
//   },
//   issues: []
// }
```

### Example 5: Minimal Strategy (Shortest Output)

```typescript
// Input
const input = {
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
};

// Collapse with minimal strategy
const result = collapse(input, { format: 'css', strategy: 'minimal' });

console.log(result);
// {
//   ok: true,
//   result: '', // Empty! All defaults, can be omitted
//   collapsed: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
//   remaining: [],
//   stats: {
//     originalCount: 4,
//     collapsedCount: 0, // Omitted entirely
//     savingsPercent: 100,
//   },
//   issues: [{
//     property: 'margin',
//     name: 'default-omitted',
//     formattedWarning: 'margin: 0 is default, omitted from output'
//   }]
// }
```

---

## 🚧 Challenges & Solutions

### Challenge 1: Value Equivalence

**Problem:** Different representations of the same value

```typescript
// These are equivalent:
'margin-top: 0;'
'margin-top: 0px;'
'margin-top: 0em;'

// These are equivalent:
'border-color: #ff0000;'
'border-color: rgb(255, 0, 0);'
'border-color: red;'
```

**Solution:** Smart value comparator

```typescript
// src/collapse/utils/value-comparator.ts
export function valuesEquivalent(a: string, b: string): boolean {
  // Normalize before comparison
  const normA = normalizeValue(a);
  const normB = normalizeValue(b);
  return normA === normB;
}

function normalizeValue(value: string): string {
  // Normalize zero values
  if (/^0(px|em|rem|%)?$/.test(value)) return '0';

  // Normalize colors
  if (isColor(value)) return normalizeColor(value);

  // Normalize calc()
  if (value.startsWith('calc(')) return evaluateCalc(value);

  return value;
}
```

### Challenge 2: Conflicting Values

**Problem:** Same property set multiple times

```typescript
// Input has duplicates or conflicts
const input = {
  marginTop: '10px',
  marginTop: '20px', // Duplicate key - JavaScript keeps last
};
```

**Solution:** Detect conflicts early

```typescript
export function detectConflicts(
  properties: Record<string, string>
): ConflictReport {
  // JavaScript objects can't have duplicate keys
  // But CSS strings can have duplicate properties

  if (typeof input === 'string') {
    const parsed = parseCSS(input);
    const conflicts = findDuplicates(parsed);

    if (conflicts.length > 0) {
      return {
        hasConflicts: true,
        conflicts,
        resolution: 'last-wins' // CSS cascade rule
      };
    }
  }

  return { hasConflicts: false };
}
```

### Challenge 3: Partial Longhand Sets

**Problem:** Incomplete longhand sets

```typescript
// Only 2 of 4 margin properties
const input = {
  marginTop: '10px',
  marginRight: '20px',
  // Missing: margin-bottom, margin-left
};
```

**Solution:** Strategy-based handling

```typescript
// Safe mode: Don't collapse
if (strategy === 'safe' && !group.complete) {
  return null;
}

// Aggressive mode: Use defaults
if (strategy === 'aggressive') {
  const missing = getMissingProperties(group);
  for (const prop of missing) {
    group.longhands.set(prop, getDefault(prop));
  }
}
```

### Challenge 4: Optimization Trade-offs

**Problem:** Multiple valid collapse options

```typescript
// Can collapse to:
// Option A: "border-top: 1px solid red; border-right: 1px solid red; ..."
// Option B: "border-width: 1px; border-style: solid; border-color: red;"
// Option C: "border: 1px solid red;"

// Which is best?
```

**Solution:** Scoring system

```typescript
interface CollapseCandidate {
  // ...
  score: number; // Higher = better
}

function scoreCandidate(candidate: CollapseCandidate): number {
  let score = 0;

  // Favor more properties collapsed
  score += candidate.longhands.length * 10;

  // Favor fewer output properties
  score += (100 - candidate.value.split(';').length) * 5;

  // Favor shorter output
  score += (1000 - candidate.value.length);

  // Favor higher confidence
  score += candidate.confidence * 100;

  return score;
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('collapse()', () => {
  describe('margin collapse', () => {
    it('should collapse uniform margins', () => {
      const input = {
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
      };

      const result = collapse(input);
      expect(result.ok).toBe(true);
      expect(result.result).toBe('margin: 10px;');
      expect(result.collapsed).toHaveLength(4);
    });

    it('should collapse 2-value margins', () => {
      const input = {
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '10px',
        marginLeft: '20px',
      };

      const result = collapse(input);
      expect(result.result).toBe('margin: 10px 20px;');
    });

    it('should not collapse incomplete sets in safe mode', () => {
      const input = {
        marginTop: '10px',
        marginRight: '20px',
      };

      const result = collapse(input, { strategy: 'safe' });
      expect(result.collapsed).toHaveLength(0);
      expect(result.remaining).toHaveLength(2);
    });
  });
});
```

### Property-Based Tests

```typescript
import fc from 'fast-check';

describe('collapse() properties', () => {
  it('collapse(expand(x)) should be equivalent to x', () => {
    fc.assert(
      fc.property(validCssShorthand, (input) => {
        const expanded = expand(input);
        const collapsed = collapse(expanded.result);

        // Semantic equivalence (not string equality)
        expect(semanticallyEquivalent(input, collapsed.result)).toBe(true);
      })
    );
  });

  it('should never increase property count', () => {
    fc.assert(
      fc.property(cssProperties, (input) => {
        const result = collapse(input);
        const outputCount = countProperties(result.result);
        const inputCount = countProperties(input);

        expect(outputCount).toBeLessThanOrEqual(inputCount);
      })
    );
  });

  it('should always produce valid CSS', () => {
    fc.assert(
      fc.property(cssProperties, (input) => {
        const result = collapse(input);

        if (result.ok) {
          expect(isValidCSS(result.result)).toBe(true);
        }
      })
    );
  });
});
```

### Integration Tests

```typescript
describe('collapse() integration', () => {
  it('should work with expand() roundtrip', () => {
    const original = 'margin: 10px; border: 1px solid red;';

    // Expand
    const expanded = expand(original);

    // Collapse
    const collapsed = collapse(expanded.result);

    // Should get back equivalent (but not necessarily identical)
    expect(collapsed.ok).toBe(true);
    expect(semanticallyEquivalent(original, collapsed.result)).toBe(true);
  });

  it('should handle mixed shorthand and longhand', () => {
    const input = `
      margin: 10px;
      padding-top: 5px;
      padding-right: 5px;
      padding-bottom: 5px;
      padding-left: 5px;
      border: 1px solid red;
    `;

    const collapsed = collapse(input);
    expect(collapsed.result).toContain('margin: 10px');
    expect(collapsed.result).toContain('padding: 5px');
    expect(collapsed.result).toContain('border: 1px solid red');
  });
});
```

### Fixture Tests

```typescript
// test/fixtures/collapse/margin.json
{
  "uniform": {
    "input": {
      "marginTop": "10px",
      "marginRight": "10px",
      "marginBottom": "10px",
      "marginLeft": "10px"
    },
    "expected": "margin: 10px;",
    "collapsed": ["margin-top", "margin-right", "margin-bottom", "margin-left"],
    "strategy": "safe"
  },
  "two-value": {
    "input": {
      "marginTop": "10px",
      "marginRight": "20px",
      "marginBottom": "10px",
      "marginLeft": "20px"
    },
    "expected": "margin: 10px 20px;",
    "collapsed": ["margin-top", "margin-right", "margin-bottom", "margin-left"],
    "strategy": "safe"
  }
}
```

---

## ⚡ Performance Considerations

### Complexity Analysis

```typescript
// Property detection: O(n) where n = number of properties
detectGroups(properties); // Linear scan

// Collapse analysis: O(m) where m = number of groups
analyzeGroups(groups); // Check each group independently

// Optimization: O(m log m) for greedy, O(2^m) for DP
optimize(groups); // Sort by savings (greedy)

// Total: O(n + m log m) ≈ O(n log n) in practice
```

### Optimization Strategies

1. **Lazy Evaluation**

```typescript
// Don't compute all candidates upfront
class LazyCollapse {
  *generateCandidates(): Generator<CollapseCandidate> {
    // Yield candidates one at a time
    // Stop early if we find optimal solution
  }
}
```

2. **Memoization**

```typescript
// Cache collapse results for common patterns
const collapseCache = new Map<string, CollapseCandidate>();

function collapseCached(key: string, fn: () => CollapseCandidate) {
  if (!collapseCache.has(key)) {
    collapseCache.set(key, fn());
  }
  return collapseCache.get(key);
}
```

3. **Early Exit**

```typescript
// Stop if we've collapsed all properties
if (collapsed.size === properties.size) {
  return result; // All done!
}
```

### Benchmarks

```typescript
// Target performance
describe('collapse() performance', () => {
  it('should handle 100 properties in <10ms', () => {
    const props = generateProperties(100);
    const start = performance.now();
    collapse(props);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(10);
  });

  it('should handle 1000 collapses in <100ms', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      collapse(sampleProperties);
    }
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

---

## 🗓️ Roadmap

### Phase 1: MVP (4 weeks)

**Week 1-2: Foundation**

- [ ] Refactor handlers to bidirectional interface
- [ ] Create property graph
- [ ] Build detector module
- [ ] Write core collapse logic for directional properties

**Week 3: Core Collapse**

- [ ] Implement collapse rules for:
  - [ ] Margin, padding (directional)
  - [ ] Border (complex)
  - [ ] Outline, column-rule (similar to border)
  - [ ] Overflow, flex-flow (simple)

**Week 4: Strategies & Testing**

- [ ] Implement safe, aggressive, minimal strategies
- [ ] Write unit tests (100+ tests)
- [ ] Add property-based tests
- [ ] Performance benchmarks

**Deliverable:** `collapse()` API with 8-10 shorthands

---

### Phase 2: Advanced Features (2 weeks)

**Week 5: Optimization**

- [ ] Greedy optimizer
- [ ] Scoring system
- [ ] Byte savings calculator
- [ ] Statistics reporting

**Week 6: Complex Shorthands**

- [ ] Background (multi-layer)
- [ ] Animation (multi-layer)
- [ ] Grid (complex syntax)
- [ ] Font (fallback handling)

**Deliverable:** Full collapse support for all 35+ shorthands

---

### Phase 3: Polish & Tooling (2 weeks)

**Week 7: Developer Experience**

- [ ] Detailed error messages
- [ ] Better warnings
- [ ] Debug mode (explain why collapse failed)
- [ ] CLI tool for testing

**Week 8: Documentation & Examples**

- [ ] API documentation
- [ ] Usage examples
- [ ] Migration guide
- [ ] Video tutorial

**Deliverable:** Production-ready collapse API

---

## ❓ Open Questions

### 1. Default Behavior

**Question:** Should default strategy be `'safe'` or `'aggressive'`?

**Options:**

- **Safe:** Conservative, only collapse complete sets
  - ✅ Pro: Predictable, no surprises
  - ❌ Con: Less useful for optimization

- **Aggressive:** Use defaults, collapse more
  - ✅ Pro: Better optimization results
  - ❌ Con: May change semantics

**Recommendation:** Default to `'safe'`, document `'aggressive'` for optimization

---

### 2. Output Format

**Question:** Should we support partial output (shorthands + remaining longhands)?

```typescript
// Option A: Include remaining
collapse(partial) → "margin: 10px; padding-top: 5px; padding-right: 5px;"

// Option B: All or nothing
collapse(partial, { includeRemaining: false }) → null (failed)
```

**Recommendation:** Support both via `includeRemaining` option (default: `true`)

---

### 3. Optimization Goal

**Question:** What should we optimize for?

**Options:**

- **Byte savings:** Minimize string length
- **Property count:** Minimize number of declarations
- **Readability:** Prefer familiar patterns

**Recommendation:** Optimize for byte savings, add `readability` mode later

---

### 4. CSS Variable Handling

**Question:** How to handle CSS variables?

```typescript
const input = {
  marginTop: 'var(--spacing)',
  marginRight: 'var(--spacing)',
  marginBottom: 'var(--spacing)',
  marginLeft: 'var(--spacing)',
};

// Can we collapse to: margin: var(--spacing)?
```

**Recommendation:** Treat CSS variables as opaque strings, collapse if all identical

---

### 5. Browser Compatibility

**Question:** Should we warn about browser support?

```typescript
// collapse() might generate: inset: 0;
// But inset has limited browser support

const result = collapse(props);
// Should we add warning: "inset" not supported in IE11?
```

**Recommendation:** Add optional `browserCompatibility` check (Phase 3 feature)

---

## 📝 Success Criteria

### Must Have

- ✅ Collapse 8+ common shorthands (margin, padding, border, etc.)
- ✅ Safe, aggressive, minimal strategies
- ✅ 95%+ test coverage
- ✅ Roundtrip compatibility: `collapse(expand(x)) ≈ x`
- ✅ Performance: <10ms for 100 properties
- ✅ TypeScript types + Zod schemas

### Should Have

- ✅ All 35+ shorthands supported
- ✅ Property-based tests
- ✅ Detailed error messages
- ✅ Statistics reporting
- ✅ CLI tool

### Nice to Have

- ✅ Dynamic programming optimizer (optimal solution)
- ✅ Browser compatibility warnings
- ✅ Readability mode
- ✅ PostCSS plugin
- ✅ ESLint plugin

---

## 🎓 Conclusion

The `collapse()` API is a **natural complement** to `expand()` that completes the bidirectional transformation story. With a phased implementation approach, we can deliver an MVP in 4 weeks and a full-featured solution in 8 weeks.

### Key Benefits Recap

1. **CSS Optimization**: Reduce bundle sizes
2. **Developer Productivity**: Auto-format generated CSS
3. **Tooling Ecosystem**: Enable linters, optimizers, refactoring tools
4. **Bidirectional Workflows**: Complete transformation cycle

### Next Steps

1. **Review & Approve** this proposal
2. **Spike**: Build proof-of-concept (1-2 days)
3. **Kick off Phase 1** (Week 1)
4. **Track progress** in project board

---

**Status:** Ready for review
**Estimated Effort:** 8 weeks (MVP in 4 weeks)
**Risk Level:** Medium
**Value:** High
