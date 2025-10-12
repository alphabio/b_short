# 🎨 b_short

[![CI](https://github.com/alphabio/b_short/actions/workflows/ci.yml/badge.svg)](https://github.com/alphabio/b_short/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/b_short.svg)](https://www.npmjs.com/package/b_short)
[![npm downloads](https://img.shields.io/npm/dm/b_short.svg)](https://www.npmjs.com/package/b_short)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Transform CSS shorthand chaos into organized longhand clarity** ✨

A lightning-fast, lightweight TypeScript library that expands CSS shorthand properties into their individual longhand equivalents. Perfect for CSS-in-JS libraries, build tools, and anyone who needs to normalize CSS properties.

```bash
pnpm add b_short
# or
npm install b_short
# or
yarn add b_short
```

## 🔧 API Reference

### `expand(css: string, options?: ExpandOptions): ExpandResult`

Expands CSS shorthand properties to longhand equivalents with comprehensive validation and error handling.

#### Parameters

- `css`: CSS declaration string(s) to expand
- `options` (optional): Configuration object

#### Options

```typescript
interface ExpandOptions {
  format?: 'js' | 'css';                        // Output format (default: 'css')
  indent?: number;                              // CSS indentation (default: 0)
  separator?: string;                           // CSS declaration separator (default: '\n')
  propertyGrouping?: 'by-property' | 'by-side'; // Property ordering strategy (default: 'by-property')
}
```

##### Property Grouping Strategies

The `propertyGrouping` option controls how CSS properties are ordered in the output:

**`by-property` (default)** - Groups properties by type (CSS specification order):

```javascript
expand('margin: 5px; border-width: 10px;', { format: 'js', propertyGrouping: 'by-property' });
// Result: All border properties, then all margin properties
// {
//   'border-top-width': '10px',
//   'border-right-width': '10px',
//   'border-bottom-width': '10px',
//   'border-left-width': '10px',
//   'margin-top': '5px',
//   'margin-right': '5px',
//   'margin-bottom': '5px',
//   'margin-left': '5px'
// }
```

**`by-side`** - Groups properties by directional side (useful for box model visualization):

```javascript
expand('margin: 5px; border-width: 10px;', { format: 'js', propertyGrouping: 'by-side' });
// Result: All top properties, then right, bottom, left
// {
//   'border-top-width': '10px',
//   'margin-top': '5px',
//   'border-right-width': '10px',
//   'margin-right': '5px',
//   'border-bottom-width': '10px',
//   'margin-bottom': '5px',
//   'border-left-width': '10px',
//   'margin-left': '5px'
// }
```

#### Returns

```typescript
interface ExpandResult {
  ok: boolean;                    // true if no CSS validation errors
  result: string | Record<string, string> | undefined;  // The expanded CSS
  issues: BStyleWarning[];       // Array of warnings and errors
}
```

## 🚀 Quick Start

```javascript
import expand from 'b_short';

// Basic usage - CSS string output (default)
const {ok, result, issues} = expand('margin: 10px 20px;');
// result: "margin-top: 10px;\nmargin-right: 20px;\nmargin-bottom: 10px;\nmargin-left: 20px;"

// JavaScript object format
const obj = expand('background: url(image.png) no-repeat #ff0;', { format: 'js' });
// obj: { 'background-image': 'url(image.png)', 'background-repeat': 'no-repeat', 'background-color': '#ff0' }
```

## Issues & Validation System

The `issues` array provides comprehensive feedback about CSS processing, helping you identify potential problems and handle edge cases gracefully.

### Issue Types

#### 1. **CSS Validation Errors** (`ok: false`)

Serious CSS syntax errors that prevent proper parsing:

```javascript
const {ok, result, issues} = expand('background: url(image.png) no-repeat #ff0; margin: ;');
// ok: false (CSS syntax error in margin declaration)
// issues: [{ name: 'css-syntax-error', property: 'margin', ... }]
```

#### 2. **Expansion Warnings** (`ok: true`)

Non-critical issues where processing continues but with warnings:

```javascript
// !important flag detected
const {ok, result, issues} = expand('margin: 10px !important;');
// ok: true
// result: { margin: '10px !important' }
// issues: [{ name: 'important-detected', property: 'margin' }]

// Unparseable shorthand
const {ok, result, issues} = expand('background: invalid-value;');
// ok: true
// result: { background: 'invalid-value' }
// issues: [{ name: 'expansion-failed', property: 'background' }]
```

### Issue Structure

```typescript
interface BStyleWarning {
  property: string;        // CSS property name
  name: string;           // Issue type identifier
  formattedWarning: string; // Human-readable message
}
```

### Common Issue Types

| Issue Name | Description | Example |
|------------|-------------|---------|
| `important-detected` | `!important` flag found | `margin: 10px !important` |
| `expansion-failed` | Shorthand couldn't be parsed | `background: invalid-value` |
| `css-syntax-error` | Invalid CSS syntax | `margin: ;` |

### Best Practices

#### Check `ok` status first

```javascript
const {ok, result, issues} = expand(cssString);

if (!ok) {
  // Handle CSS syntax errors
  console.error(issues);
  return;
}

// Process successful expansion
console.log('Expanded CSS:', result);

// Check for warnings (non-blocking)
if (issues.length > 0) {
  console.warn('Processing warnings:', issues);
}
```

#### Handle specific issue types

```javascript
issues.forEach(issue => {
  switch (issue.name) {
    case 'important-detected':
      console.log(`Property ${issue.property} has !important - review if needed`);
      break;
    case 'expansion-failed':
      console.log(`Property ${issue.property} couldn't be expanded - using as-is`);
      break;
  }
});
```

## ⚠️ Limitations

### !important Flag Handling

The `!important` flag is detected and preserved. A warning is added to the `issues` array, but the declaration is left untouched:

```javascript
const {ok, result, issues} = expand('margin: 10px !important; margin-top: 5px;');
// ok: true
// result: {
//   'margin': '10px !important',    // Shorthand preserved with !important
//   'margin-top': '5px'             // Longhand declarations still processed
// }
// issues: [{ property: 'margin', name: 'important-detected', ... }]
```

**Rationale**: The `!important` flag indicates a deliberate authoring choice that should be preserved. Shorthand properties with `!important` are left as-is to maintain the author's intent.

### Unparseable Shorthands

If a shorthand property cannot be parsed (invalid syntax or unsupported pattern), the original shorthand is returned as-is with a warning:

```javascript
const {ok, result, issues} = expand('background: invalid-value;');
// ok: true (no syntax errors from css-tree)
// result: { background: 'invalid-value' }
// issues: [{ property: 'background', name: 'expansion-failed', ... }]
```

## 🎯 Supported Properties

Currently supporting **35 CSS shorthand properties** with comprehensive shorthand expansion:

### Layout & Positioning (9 properties)

- **Flexbox**: `flex`, `flex-flow`
- **Grid**: `grid`, `grid-area`, `grid-column`, `grid-row`
- **Positioning**: `inset`
- **Alignment**: `place-content`, `place-items`, `place-self`

### Spacing (2 properties)

- `margin`, `padding`

### Visual Styling (13 properties)

- **Background**: `background` (multi-layer)
- **Borders**: `border`, `border-top`, `border-right`, `border-bottom`, `border-left`, `border-color`, `border-style`, `border-width`, `border-radius`
- **Typography**: `font`, `text-decoration`, `text-emphasis`
- **Lists**: `list-style`
- **Outline**: `outline`

### Animation & Motion (3 properties)

- `animation` (multi-layer), `transition` (multi-layer), `offset`

### Advanced Features (8 properties)

- **Masking**: `mask` (multi-layer)
- **Columns**: `columns`, `column-rule`
- **Overflow**: `overflow`
- **Containment**: `contain-intrinsic-size`

## 💡 Use Cases

### CSS-in-JS Libraries

```javascript
// styled-components, emotion, etc.
const expandedStyles = expand('margin: 10px 20px; padding: 5px;');
// → { marginTop: '10px', marginRight: '20px', ... }
```

### Build Tools & PostCSS Plugins

```javascript
// Normalize CSS properties for consistent processing
const normalized = expand(cssString, { format: 'js' });
```

### CSS Analysis & Linting

```javascript
// Extract individual properties for analysis
const properties = expand('background: url(img.png) no-repeat center;');
// → { 'background-image': 'url(img.png)', 'background-repeat': 'no-repeat', ... }
```

## ⚡ Performance

- **Lightning Fast**: Minimal dependencies, optimized TypeScript
- **Bundle Size**: ~15KB minified (check [Bundlephobia](https://bundlephobia.com/package/b_short))
- **Memory Efficient**: No runtime allocations for repeated calls
- **Type Safe**: Full TypeScript support with inferred types
- **Comprehensive Coverage**: 35 shorthands with 200+ test cases
- **Zero Regressions**: All functionality thoroughly tested

## 🎯 Supported Properties

Currently supporting **35 CSS shorthand properties** with comprehensive shorthand expansion:

### Layout & Positioning (9 properties)

- **Flexbox**: `flex`, `flex-flow`
- **Grid**: `grid`, `grid-area`, `grid-column`, `grid-row`
- **Positioning**: `inset`
- **Alignment**: `place-content`, `place-items`, `place-self`

### Spacing (2 properties)

- `margin`, `padding`

### Visual Styling (13 properties)

- **Background**: `background` (multi-layer)
- **Borders**: `border`, `border-top`, `border-right`, `border-bottom`, `border-left`, `border-color`, `border-style`, `border-width`, `border-radius`
- **Typography**: `font`, `text-decoration`, `text-emphasis`
- **Lists**: `list-style`
- **Outline**: `outline`

### Animation & Motion (3 properties)

- `animation` (multi-layer), `transition` (multi-layer), `offset`

### Advanced Features (8 properties)

- **Masking**: `mask` (multi-layer)
- **Columns**: `columns`, `column-rule`
- **Overflow**: `overflow`
- **Containment**: `contain-intrinsic-size`

## 💡 Use Cases

### CSS-in-JS Libraries

```javascript
// styled-components, emotion, etc.
const expandedStyles = expand('margin: 10px 20px; padding: 5px;');
// → { marginTop: '10px', marginRight: '20px', ... }
```

### Build Tools & PostCSS Plugins

```javascript
// Normalize CSS properties for consistent processing
const normalized = expand(cssString, { format: 'js' });
```

### CSS Analysis & Linting

```javascript
// Extract individual properties for analysis
const properties = expand('background: url(img.png) no-repeat center;');
// → { 'background-image': 'url(img.png)', 'background-repeat': 'no-repeat', ... }
```

### Animation Libraries

```javascript
// Expand complex animations and transitions
expand('animation: spin 1s ease-in-out, fade 2s linear;');
// → Multiple expanded animation properties
```

### CSS Motion Path Support ✨

```javascript
// New! Complete offset shorthand expansion
expand('offset: 10px 30px path("M 0 0 L 100 100") 50px auto 45deg / center;');
// → {
//     'offset-position': '10px 30px',
//     'offset-path': 'path("M 0 0 L 100 100")',
//     'offset-distance': '50px',
//     'offset-rotate': 'auto 45deg',
//     'offset-anchor': 'center'
//   }
```

### Grid Layout

```javascript
// Perfect for CSS Grid frameworks
const gridStyles = expand('grid: repeat(3, 1fr) / auto; place-items: center;');
// → { 'grid-template-columns': 'repeat(3, 1fr)', 'grid-template-rows': 'auto', 'align-items': 'center', 'justify-items': 'center' }
```

### Flexbox

```javascript
// Flexbox utilities
const flexStyles = expand('flex: 1 1 0%; flex-flow: row wrap;');
// → { 'flex-grow': '1', 'flex-shrink': '1', 'flex-basis': '0%', 'flex-direction': 'row', 'flex-wrap': 'wrap' }
```

### Multi-layer Animations

```javascript
// Complex animations for UI libraries
const animations = expand('animation: slideIn 0.3s ease-out, fadeIn 0.5s ease-in; transition: all 0.2s ease;');
// → Expanded animation and transition properties
```

### Mask Effects

```javascript
// Advanced masking for design systems
const maskStyles = expand('mask: url(circle.svg) center / 50px 50px no-repeat, radial-gradient(circle at center, black 50%, transparent 50%);');
// → Complete mask expansion
```

## ⚡ Performance

- **Lightning Fast**: Minimal dependencies, optimized TypeScript
- **Bundle Size**: ~15KB minified (check [Bundlephobia](https://bundlephobia.com/package/b_short))
- **Memory Efficient**: No runtime allocations for repeated calls
- **Type Safe**: Full TypeScript support with inferred types
- **Comprehensive Coverage**: 35 shorthands with 200+ test cases
- **Zero Regressions**: All functionality thoroughly tested

## 🔧 API Reference

### `expand(css: string, options?: ExpandOptions): ExpandedResult`

Expands CSS shorthand properties to longhand equivalents.

#### Parameters

- `css`: CSS declaration string(s) to expand
- `options` (optional): Configuration object

#### Options

```typescript
interface ExpandOptions {
  format?: 'js' | 'css';     // Output format (default: 'css')
  indent?: number;           // CSS indentation (default: 0)
  separator?: string;        // CSS declaration separator (default: '\n')
}
```

#### Returns

- **CSS format** (default): Formatted CSS string (multiple declarations are joined)
- **JS format**: `{ [property: string]: string }` (multiple declarations are merged into a single object, with later properties overriding earlier ones following standard CSS cascade rules)

#### Examples

```typescript
// Single declaration - CSS string (default)
expand('margin: 10px;');
// → "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;"

// Multiple declarations - CSS string (joined)
expand('margin: 10px; padding: 5px;');
// → "margin-top: 10px;\nmargin-right: 10px;\nmargin-bottom: 10px;\nmargin-left: 10px;\npadding-top: 5px;\npadding-right: 5px;\npadding-bottom: 5px;\npadding-left: 5px;"

// JavaScript object output (single declaration)
expand('margin: 10px;', { format: 'js' });
// → { 'margin-top': '10px', 'margin-right': '10px', 'margin-bottom': '10px', 'margin-left': '10px' }

// JavaScript object output (multiple declarations - merged)
expand('margin: 10px; padding: 5px;', { format: 'js' });
// → { 'margin-top': '10px', 'margin-right': '10px', 'margin-bottom': '10px', 'margin-left': '10px', 'padding-top': '5px', 'padding-right': '5px', 'padding-bottom': '5px', 'padding-left': '5px' }

// Property override example
expand('background: url(a.png); background-size: cover;', { format: 'js' });
// The explicit background-size overrides the default from background expansion
// → { 'background-image': 'url(a.png)', 'background-size': 'cover' }
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Testing requirements
- Pull request process

## 📄 License

MIT © [alphabio](https://github.com/alphabio)

---

<div align="center">

**Made by [alphabio](https://alphab.io)**

[⭐ Star us on GitHub](https://github.com/alphabio/b_short) • [📖 Read the docs](https://github.com/alphabio/b_short#readme) • [🐛 Report bugs](https://github.com/alphabio/b_short/issues)

</div>
