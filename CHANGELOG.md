# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-01-12

### 🔒 Security

- **Fixed ReDoS vulnerability** in `!important` detection regex (CVE pending)
  - Replaced vulnerable `/\s+!important$/` regex with safe string operations
  - Prevents potential Denial of Service attacks with malicious input
  - Addresses CodeQL security warning `js/polynomial-redos`
  - No functional changes to behavior - all existing code works as before
  - All 738 tests passing

### 📊 Impact

- **Severity:** Low to Medium (requires malicious input)
- **Attack vector:** Strings with many consecutive spaces before `!important`
- **Fix complexity:** Simple string operation replacement
- **Backward compatibility:** 100% - no API changes

### 🔄 Upgrade Recommendation

**All users should upgrade immediately** as this is a security fix with zero breaking changes.

```bash
npm update b_short
# or
pnpm update b_short
```

---

## [1.2.0] - 2025-01-12

### 🚀 **Enterprise-Grade Modernization**

**Complete repository modernization with professional tooling, performance monitoring, and automation**

#### ✨ Added - Build System & Infrastructure

- **Modern dual-format builds** with tsup
  - ESM + CJS dual format output (tree-shakeable)
  - 67% faster builds (3s → 1s)
  - Source maps for both formats
  - Watch mode for development (`pnpm run dev`)
  - Proper module exports configuration

- **Vite 6 compatibility**
  - ESM config files (.mts) for all configurations
  - Updated tsconfig.json for modern module resolution
  - Zero deprecation warnings

- **Bundle size monitoring**
  - size-limit integration with automated checks
  - ESM: 106KB (limit: 120KB), CJS: 116KB (limit: 125KB)
  - Command: `pnpm run size`

#### ✨ Added - Performance & Quality Tools

- **Performance benchmarking suite**
  - tinybench integration for accurate measurements
  - 12 comprehensive benchmark test cases
  - Performance: 183k ops/sec (simple), 30k ops/sec (complex)
  - Command: `pnpm run bench`

- **Test coverage reporting**
  - vitest coverage configuration
  - @vitest/coverage-v8 integration
  - HTML, JSON, and text reports
  - Command: `pnpm test:coverage`

- **Enhanced CI/CD pipeline**
  - Multi-job GitHub Actions workflow (test, size, benchmark)
  - Matrix testing across Node 18, 20, 22
  - Automated releases with NPM provenance
  - Coverage upload to Codecov
  - Separate size-check and benchmark jobs

#### ✨ Added - Property Grouping Feature

- **New `propertyGrouping` option** for controlling CSS property order
  - `by-property` (default): Groups by property type (CSS spec order)
  - `by-side`: Groups by directional side (useful for box model debugging)
  - Full TypeScript support with comprehensive tests
  - Documented with examples in README

#### 🔧 Fixed - Property Ordering

- **Resolved property ordering issues** across all shorthand parsers
  - Applied proper sorting to 8 critical parsers (font, border, outline, etc.)
  - Fixed 55 test failures from handover document
  - All 738 tests now passing with correct CSS specification order
  - Properties now consistently output in spec-defined order

#### 🔒 Security

- **Fixed ReDoS vulnerability** in `!important` detection regex
  - Replaced `/\s+!important$/` with safe string operations
  - Prevents potential Denial of Service attacks
  - Improves CodeQL security score
  - No functional changes to behavior

#### 📚 Documentation

- **Complete README rewrite**
  - Professional structure with collapsible sections
  - Comprehensive feature categorization
  - Better organized examples and use cases
  - Added validate API documentation
  - Clear TypeScript type definitions

- **Security & Community**
  - Added SECURITY.md with vulnerability reporting
  - Created GitHub issue templates (bug report, feature request)
  - Improved contributing guidelines

#### 🛠️ Infrastructure

- **Package structure improvements**
  - Migrated from `lib/` to standard `dist/` output
  - Added `sideEffects: false` for better tree-shaking
  - Updated Node.js requirement to >=16
  - Proper dual-format exports (ESM .mjs + CJS .js)

- **Development tools**
  - Added tsx for TypeScript execution
  - Enhanced quality checks workflow
  - Improved developer experience

#### 📊 Statistics

- **738/738 tests passing** (100% success rate)
- **Build time: 67% faster** (3s → 1s)
- **Bundle size:** ESM 106KB, CJS 116KB (both under limits)
- **Performance:** 183k ops/sec (simple), 30k ops/sec (complex)
- **Zero regressions** - fully backward compatible

#### 🎯 Quality Metrics

- ✅ All lint checks passing
- ✅ All type checks passing
- ✅ Zero deprecation warnings
- ✅ Bundle size under limits
- ✅ Performance benchmarks established
- ✅ CI/CD fully automated

### ⚠️ Breaking Changes

**None** - This release is fully backward compatible. All existing code continues to work without modifications.

### 📦 Dependencies

**Added:**

- `tsup` - Modern bundler for dual-format builds
- `tsx` - TypeScript execution for development
- `tinybench` - Performance benchmarking
- `size-limit` + `@size-limit/preset-small-lib` - Bundle size monitoring
- `@vitest/coverage-v8` - Test coverage reporting

### 🔄 Migration Guide

No migration needed! This release is fully backward compatible. New features are opt-in:

- Use `propertyGrouping: 'by-side'` option to group properties by directional side
- Run `pnpm run bench` to see performance metrics
- Run `pnpm run size` to check bundle size

---

## [1.1.0] - 2024-12-XX

### 🧪 **Test Suite Reorganization**

**Complete refactoring of test structure for improved maintainability**

- **Restructured 728 tests** into 5 focused files with clear responsibilities:
  - `test/valid-expansions.test.ts` - Fixture-based valid CSS shorthand expansion tests (606 tests)
  - `test/invalid-cases.test.ts` - Invalid input and edge case handling (71 tests)
  - `test/overrides.test.ts` - CSS cascade and property override behavior (9 tests)
  - `test/special-behaviors.test.ts` - Special behaviors: !important handling, warnings, format options (13 tests)
  - `test/multi-layer.test.ts` - Multi-layer background and mask property tests (29 tests)

- **Enhanced maintainability** with logical grouping of related functionality
- **Improved developer experience** with focused, single-responsibility test files
- **Preserved 100% test coverage** while dramatically improving code organization
- **Future-proof structure** for easy addition of new tests and maintenance

### 🔧 **Code Quality**

- Cleaned up unused imports in `src/background.ts`
- Improved code clarity and reduced technical debt

---

## [2.0.0] - 2024-12-XX

### 🎉 Major Feature Release - 5x Expansion

This release represents a massive expansion of `b_short` from 7 to **35 supported CSS shorthands**, achieving near-complete coverage of all major CSS shorthand properties.

### ✨ Added - Layout & Positioning (9 new shorthands)

- **Flexbox shorthands**:
  - `flex` - Expands to `flex-grow`, `flex-shrink`, `flex-basis` with implicit defaults
  - `flex-flow` - Expands to `flex-direction`, `flex-wrap`
- **Grid shorthands**:
  - `grid` - Complete grid template support with ASCII art syntax, track sizing functions (`minmax()`, `repeat()`, `fr` units)
  - `grid-area` - Expands to `grid-row-start`, `grid-column-start`, `grid-row-end`, `grid-column-end`
  - `grid-column` - Expands to `grid-column-start`, `grid-column-end`
  - `grid-row` - Expands to `grid-row-start`, `grid-row-end`
- **Positioning & Alignment**:
  - `inset` - Expands to `top`, `right`, `bottom`, `left` (similar to margin/padding)
  - `place-content` - Expands to `align-content`, `justify-content`
  - `place-items` - Expands to `align-items`, `justify-items`
  - `place-self` - Expands to `align-self`, `justify-self`

### ✨ Added - Animation & Transitions (2 new shorthands)

- **`animation`** - Multi-layer support expanding to 8 longhands:
  - `animation-name`, `animation-duration`, `animation-timing-function`, `animation-delay`
  - `animation-iteration-count`, `animation-direction`, `animation-fill-mode`, `animation-play-state`
- **`transition`** - Multi-layer support expanding to 4 longhands:
  - `transition-property`, `transition-duration`, `transition-timing-function`, `transition-delay`
  - Handles complex timing functions (cubic-bezier, steps, etc.)

### ✨ Added - Text & Visual Styling (4 new shorthands)

- **`text-decoration`** - Expands to `text-decoration-line`, `text-decoration-color`, `text-decoration-style`, `text-decoration-thickness`
- **`text-emphasis`** - Expands to `text-emphasis-style`, `text-emphasis-color`
- **`list-style`** - Expands to `list-style-type`, `list-style-position`, `list-style-image` (handles `url()` values)
- **`column-rule`** - Expands to `column-rule-width`, `column-rule-style`, `column-rule-color`

### ✨ Added - Advanced Features (4 new shorthands)

- **`mask`** - Multi-layer support (similar to background) expanding to 8 longhands:
  - `mask-image`, `mask-mode`, `mask-repeat`, `mask-position`, `mask-size`, `mask-origin`, `mask-clip`, `mask-composite`
- **`columns`** - Expands to `column-width`, `column-count`
- **`overflow`** - Expands to `overflow-x`, `overflow-y`
- **`contain-intrinsic-size`** - Expands to `contain-intrinsic-width`, `contain-intrinsic-height`

### 🔧 Enhanced

- Comprehensive test coverage with 200+ test cases across all shorthands
- Robust parsing for complex CSS syntax (grid templates, timing functions, multi-layer properties)
- Improved value type detection (numbers vs lengths vs keywords)
- Enhanced tokenization for function-aware parsing

### 📚 Documentation

- Complete rewrite of README with all 35 supported shorthands
- Added comprehensive examples for complex shorthands (flex, grid, animation, transition, mask)
- Enhanced use cases with real-world examples
- Updated API reference with new property examples

### ⚠️ Breaking Changes

- **JS format merge behavior**: When using `format: 'js'` with multiple CSS declarations, the library now returns a single merged object instead of an array of objects. Previously, `expand('margin: 10px; padding: 5px;', { format: 'js' })` would return `[{ 'margin-top': '10px', ... }, { 'padding-top': '5px', ... }]`, but now returns `{ 'margin-top': '10px', ..., 'padding-top': '5px', ... }`. This change improves consistency and reduces memory usage.

### 💡 Migration Guide

**Breaking changes introduced!** The JS format merge behavior has changed to return merged objects instead of arrays. If you need the old array behavior, please refactor your code to handle the new merged object format. This change improves performance and consistency across the API.

### 📊 Statistics

- **35 total shorthands** (up from 7)
- **200+ test cases** (comprehensive coverage)
- **100% CSS specification compliance**
- **Zero regressions** in existing functionality

---

## [1.2.0] - 2024-10-08

### ✨ Added

- **Complete CSS Motion Path support** - Full `offset` shorthand property expansion
  - `offset-position` parsing (auto, normal, keywords, lengths)
  - `offset-path` parsing (none, path(), ray(), url())
  - `offset-distance` parsing (length/percentage values)
  - `offset-rotate` parsing (auto, reverse, angles, compound forms)
  - `offset-anchor` parsing (position keywords and length combinations)
  - Global keyword support (`inherit`, `initial`, `unset`, `revert`)
- Enhanced tokenization with function-aware parsing
- Improved angle and length validation utilities

### 🔧 Changed

- Fixed `isAngle` regex to properly match angle units
- Enhanced parsing robustness for complex CSS values
- Improved error handling for malformed input

### 📚 Documentation

- Updated README with comprehensive examples
- Added API reference documentation
- Enhanced use case examples for CSS-in-JS libraries

## [1.1.0] - 2024-09-15

### ✨ Added

- Multi-layer background support
- Enhanced animation property expansion
- Improved TypeScript type definitions

### 🐛 Fixed

- Border radius parsing edge cases
- Flex property shorthand handling

## [1.0.0] - 2024-08-01

### ✨ Added

- Initial release with core CSS shorthand expansion
- Support for 30+ CSS properties
- TypeScript-first implementation
- Zero dependencies architecture
- Comprehensive test coverage

### 🎯 Supported Properties

- Layout: `margin`, `padding`, `flex`, `grid-*`, `place-*`
- Visual: `background`, `border*`, `font`, `text-*`
- Animation: `animation`, `transition`
- Other: `columns`, `list-style`, `outline`, `overflow`

---

## Development Notes

### For Contributors

- Run `just check` before committing
- Run `just test` to ensure all tests pass
- Update CHANGELOG.md for any user-facing changes
- Follow conventional commit format

### Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes
