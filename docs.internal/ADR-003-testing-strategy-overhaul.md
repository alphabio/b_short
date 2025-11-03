# ADR-003: Comprehensive Testing Strategy Overhaul

**Status:** Proposed  
**Date:** 2025-11-03  
**Deciders:** Architecture Team  

---

## Context and Problem Statement

Our current testing approach has several issues:

**Current State:**
```
test/
├── collapse.test.ts          (28KB - monolithic!)
├── valid-expansions.test.ts  (2.8KB - uses fixtures!)
├── invalid-cases.test.ts     (22KB)
├── fixtures/                 (31 JSON files ✅)
│   ├── overflow.json
│   ├── margin.json
│   └── ...
└── helpers/
```

**Problems:**

1. **❌ Monolithic Test Files** - `collapse.test.ts` is 28KB with 92 tests
2. **❌ No Co-location** - Tests are far from source code
3. **❌ Missing Edge Cases** - Especially for collapse handlers
4. **❌ Inconsistent Patterns** - Some use fixtures, some are inline
5. **❌ Poor Discoverability** - Can't see what's tested by looking at handler
6. **❌ Hard to Maintain** - Adding handler requires updating central test file

**User Feedback:**
> "We need co-located tests and fixture-based generation for better DX"

---

## Decision Drivers

1. **Co-location** - Tests should live next to the code they test
2. **Fixture-driven** - Generate tests from declarative data
3. **Discoverability** - Opening handler shows its tests immediately
4. **Maintainability** - Adding handler auto-adds tests
5. **Edge Case Coverage** - Systematic testing of all scenarios
6. **DX** - Better experience opening codebase

---

## Proposed Structure

### Target Architecture

```
src/handlers/overflow/
├── expand.ts
├── expand.test.ts          ← Co-located!
├── collapse.ts
├── collapse.test.ts        ← Co-located!
├── fixtures/               ← Handler-specific fixtures
│   ├── expand.json
│   ├── collapse.json
│   └── edge-cases.json
└── index.ts

src/handlers/background/
├── expand.ts
├── expand.test.ts
├── collapse.ts
├── collapse.test.ts
├── collapse-parser.ts
├── collapse-parser.test.ts ← Test utilities too!
├── fixtures/
│   ├── expand.json
│   ├── collapse.json
│   └── multi-layer.json
└── index.ts
```

### Fixture-Driven Test Generation

```typescript
// src/handlers/overflow/fixtures/collapse.json
{
  "name": "overflow collapse",
  "valid": [
    {
      "description": "collapses same values",
      "input": {
        "overflow-x": "hidden",
        "overflow-y": "hidden"
      },
      "expected": {
        "overflow": "hidden"
      }
    },
    {
      "description": "collapses different values",
      "input": {
        "overflow-x": "hidden",
        "overflow-y": "auto"
      },
      "expected": {
        "overflow": "hidden auto"
      }
    }
  ],
  "invalid": [
    {
      "description": "does not collapse invalid values",
      "input": {
        "overflow-x": "xyz",
        "overflow-y": "auto"
      },
      "expected": {
        "overflow-x": "xyz",
        "overflow-y": "auto"
      },
      "issues": []
    }
  ],
  "edge": [
    {
      "description": "incomplete longhands",
      "input": {
        "overflow-x": "hidden"
      },
      "expected": {
        "overflow-x": "hidden"
      },
      "issues": [{ "name": "incomplete-longhands" }]
    }
  ]
}
```

```typescript
// src/handlers/overflow/collapse.test.ts
import { describe, test, expect } from 'vitest';
import { collapse } from '@/core/collapse';
import { generateCollapseTests } from '@/test/generators';
import fixtures from './fixtures/collapse.json';

describe('overflow collapse', () => {
  // Auto-generate tests from fixtures
  generateCollapseTests('overflow', fixtures);
  
  // Additional manual tests
  test('handles global keywords', () => {
    const result = collapse({
      "overflow-x": "inherit",
      "overflow-y": "inherit"
    });
    expect(result.result).toEqual({ overflow: "inherit" });
  });
});
```

---

## Detailed Design

### 1. Test Utilities

```typescript
// test/generators/collapse-generator.ts
export interface CollapseTestCase {
  description: string;
  input: Record<string, string>;
  expected: Record<string, string>;
  issues?: Array<{ name: string; [key: string]: any }>;
}

export interface CollapseFixture {
  name: string;
  valid: CollapseTestCase[];
  invalid: CollapseTestCase[];
  edge: CollapseTestCase[];
}

export function generateCollapseTests(
  shorthand: string,
  fixture: CollapseFixture
) {
  describe(`${fixture.name} - valid cases`, () => {
    for (const testCase of fixture.valid) {
      test(testCase.description, () => {
        const result = collapse(testCase.input);
        expect(result.ok).toBe(true);
        expect(result.result).toEqual(testCase.expected);
        if (testCase.issues) {
          expect(result.issues).toMatchObject(testCase.issues);
        } else {
          expect(result.issues).toEqual([]);
        }
      });
    }
  });

  describe(`${fixture.name} - invalid cases`, () => {
    for (const testCase of fixture.invalid) {
      test(testCase.description, () => {
        const result = collapse(testCase.input);
        expect(result.ok).toBe(true);
        expect(result.result).toEqual(testCase.expected);
        if (testCase.issues) {
          expect(result.issues).toMatchObject(testCase.issues);
        }
      });
    }
  });

  describe(`${fixture.name} - edge cases`, () => {
    for (const testCase of fixture.edge) {
      test(testCase.description, () => {
        const result = collapse(testCase.input);
        expect(result.ok).toBe(true);
        expect(result.result).toEqual(testCase.expected);
        if (testCase.issues) {
          expect(result.issues).toMatchObject(testCase.issues);
        }
      });
    }
  });
}
```

### 2. Expand Test Generator

```typescript
// test/generators/expand-generator.ts
export interface ExpandTestCase {
  description: string;
  input: string;
  expected: Record<string, string>;
  issues?: Array<{ name: string; [key: string]: any }>;
}

export interface ExpandFixture {
  name: string;
  property: string;
  valid: ExpandTestCase[];
  invalid: ExpandTestCase[];
  edge: ExpandTestCase[];
}

export function generateExpandTests(
  property: string,
  fixture: ExpandFixture
) {
  // Similar structure to generateCollapseTests
  // ...
}
```

### 3. Fixture Schema

```typescript
// test/schemas/fixture.schema.ts
import { z } from 'zod';

export const collapseTestCaseSchema = z.object({
  description: z.string(),
  input: z.record(z.string()),
  expected: z.record(z.string()),
  issues: z.array(z.object({
    name: z.string(),
  })).optional(),
});

export const collapseFixtureSchema = z.object({
  name: z.string(),
  valid: z.array(collapseTestCaseSchema),
  invalid: z.array(collapseTestCaseSchema),
  edge: z.array(collapseTestCaseSchema),
});

// Validate fixtures at test time
export function validateFixture<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}
```

---

## Migration Strategy

### Phase 1: Infrastructure (Week 1)

1. Create test generators
2. Create fixture schemas
3. Create validation utilities
4. Add vitest configuration for co-located tests

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    include: [
      'test/**/*.test.ts',
      'src/**/*.test.ts',  // ← Add co-located tests
    ],
  },
});
```

### Phase 2: Migrate Simple Handlers (Week 2)

Start with simple handlers to validate approach:

1. **overflow** (2 longhands)
   - `src/handlers/overflow/expand.test.ts`
   - `src/handlers/overflow/collapse.test.ts`
   - `src/handlers/overflow/fixtures/`

2. **flex-flow** (2 longhands)
3. **gap** (2 longhands)
4. **place-content** (2 longhands)

**Success Criteria:**
- Tests pass
- Coverage maintained
- DX improved
- Edge cases added

### Phase 3: Migrate Medium Handlers (Week 3)

Handlers with moderate complexity:

5. **list-style** (3 longhands)
6. **text-emphasis** (3 longhands)
7. **outline** (3 longhands)
8. **column-rule** (3 longhands)
9. **border-radius** (4 longhands)
10. **columns** (2 longhands)

### Phase 4: Migrate Complex Handlers (Week 4)

Multi-layer and complex handlers:

11. **background** (8 longhands + multi-layer)
12. **mask** (8 longhands + multi-layer)
13. **transition** (4 longhands + multi-layer)
14. **animation** (8 longhands + multi-layer)
15. **grid** (complex forms)
16. **font** (order-dependent)
17. **border** (12 longhands)

### Phase 5: Cleanup (Week 5)

1. Remove old monolithic test files
2. Update CI configuration
3. Add test coverage reporting
4. Document testing patterns

---

## Edge Cases to Cover

### Collapse Edge Cases

Each handler should test:

1. **Valid Values**
   - ✅ All longhands present
   - ✅ Different value combinations
   - ✅ Global keywords (inherit, initial, unset, revert)

2. **Invalid Values**
   - ⚠️ Invalid CSS values (xyz, 999, etc.)
   - ⚠️ Wrong value types
   - ⚠️ Out-of-spec syntax

3. **Edge Cases**
   - ⚠️ Incomplete longhands
   - ⚠️ Missing required longhands
   - ⚠️ Conflicting values
   - ⚠️ Default values only
   - ⚠️ Mix of defaults and non-defaults

4. **Multi-layer Properties** (background, mask, transition, animation)
   - ⚠️ Single layer
   - ⚠️ Multiple layers
   - ⚠️ Mismatched layer counts
   - ⚠️ Empty layers
   - ⚠️ Default layers

5. **Validation** (NEW - per ADR for validation bug)
   - ⚠️ Invalid longhand values should NOT collapse
   - ⚠️ Validation warnings should be reported

### Example: Comprehensive Overflow Fixture

```json
{
  "name": "overflow",
  "valid": [
    {
      "description": "same values",
      "input": { "overflow-x": "hidden", "overflow-y": "hidden" },
      "expected": { "overflow": "hidden" }
    },
    {
      "description": "different values",
      "input": { "overflow-x": "hidden", "overflow-y": "auto" },
      "expected": { "overflow": "hidden auto" }
    },
    {
      "description": "all valid values",
      "input": { "overflow-x": "visible", "overflow-y": "visible" },
      "expected": { "overflow": "visible" }
    },
    {
      "description": "clip value",
      "input": { "overflow-x": "clip", "overflow-y": "hidden" },
      "expected": { "overflow": "clip hidden" }
    },
    {
      "description": "global keyword inherit",
      "input": { "overflow-x": "inherit", "overflow-y": "inherit" },
      "expected": { "overflow": "inherit" }
    }
  ],
  "invalid": [
    {
      "description": "invalid overflow-x",
      "input": { "overflow-x": "xyz", "overflow-y": "auto" },
      "expected": { "overflow-x": "xyz", "overflow-y": "auto" },
      "issues": []
    },
    {
      "description": "invalid overflow-y",
      "input": { "overflow-x": "hidden", "overflow-y": "invalid" },
      "expected": { "overflow-x": "hidden", "overflow-y": "invalid" }
    },
    {
      "description": "both invalid",
      "input": { "overflow-x": "bad1", "overflow-y": "bad2" },
      "expected": { "overflow-x": "bad1", "overflow-y": "bad2" }
    }
  ],
  "edge": [
    {
      "description": "missing overflow-y",
      "input": { "overflow-x": "hidden" },
      "expected": { "overflow-x": "hidden" },
      "issues": [{ "name": "incomplete-longhands", "property": "overflow" }]
    },
    {
      "description": "missing overflow-x",
      "input": { "overflow-y": "auto" },
      "expected": { "overflow-y": "auto" },
      "issues": [{ "name": "incomplete-longhands", "property": "overflow" }]
    },
    {
      "description": "empty input",
      "input": {},
      "expected": {},
      "issues": []
    },
    {
      "description": "unrelated property",
      "input": { "margin": "10px" },
      "expected": { "margin": "10px" }
    },
    {
      "description": "mixed with other properties",
      "input": { "overflow-x": "hidden", "overflow-y": "auto", "margin": "10px" },
      "expected": { "overflow": "hidden auto", "margin": "10px" }
    }
  ]
}
```

---

## Benefits

### For Developers

```typescript
// Before: Where are the overflow tests?
// Must search through 28KB collapse.test.ts

// After: Right next to the code!
src/handlers/overflow/
├── collapse.ts          ← Implementation
├── collapse.test.ts     ← Tests here!
├── fixtures/
│   └── collapse.json    ← Test data here!
```

### For Maintainers

```typescript
// Before: Adding a new handler
// 1. Write handler code in src/handlers/new-prop/
// 2. Navigate to test/collapse.test.ts
// 3. Find the right place to add tests (where?)
// 4. Add tests manually (copy-paste, error-prone)

// After: Adding a new handler
// 1. Write handler code in src/handlers/new-prop/
// 2. Create collapse.test.ts in same directory
// 3. Create fixtures/collapse.json with test cases
// 4. Test generator handles the rest!
```

### For Code Review

```typescript
// PR: "Add mask collapse handler"
// Changed files:
//   src/handlers/mask/collapse.ts          ← Implementation
//   src/handlers/mask/collapse.test.ts     ← Tests
//   src/handlers/mask/fixtures/collapse.json ← Data

// Reviewer can see:
// ✅ What changed (one handler)
// ✅ Tests are present
// ✅ Edge cases covered
// All in one place!
```

---

## Testing Patterns

### Pattern 1: Simple Handler (overflow, gap, flex-flow)

```typescript
// src/handlers/overflow/collapse.test.ts
import { generateCollapseTests } from '@/test/generators';
import fixtures from './fixtures/collapse.json';

generateCollapseTests('overflow', fixtures);
```

That's it! 3 lines for comprehensive testing.

### Pattern 2: Complex Handler (background, animation)

```typescript
// src/handlers/background/collapse.test.ts
import { generateCollapseTests } from '@/test/generators';
import fixtures from './fixtures/collapse.json';
import multiLayerFixtures from './fixtures/multi-layer.json';

// Standard tests
generateCollapseTests('background', fixtures);

// Additional multi-layer tests
generateCollapseTests('background-multi-layer', multiLayerFixtures);

// Custom tests for special cases
describe('background collapse - special cases', () => {
  test('color only', () => {
    // ...
  });
  
  test('omits all defaults', () => {
    // ...
  });
});
```

### Pattern 3: Handler with Utilities

```typescript
// src/handlers/background/collapse-parser.test.ts
import { parseMaskProperties } from './collapse-parser';

describe('parseBackgroundProperties', () => {
  test('splits layers by comma', () => {
    const result = parseMaskProperties({
      'background-image': 'url(a.png), url(b.png)',
    });
    expect(result.layers).toHaveLength(2);
  });
  
  // More unit tests for utility functions
});
```

---

## File Organization

### Directory Structure

```
src/handlers/{property}/
├── expand.ts                   ← Expand implementation
├── expand.test.ts              ← Expand tests
├── collapse.ts                 ← Collapse implementation
├── collapse.test.ts            ← Collapse tests
├── collapse-parser.ts          ← Utility (if needed)
├── collapse-parser.test.ts     ← Utility tests
├── fixtures/
│   ├── expand.json             ← Expand test cases
│   ├── collapse.json           ← Collapse test cases
│   ├── edge-cases.json         ← Edge case test cases
│   └── multi-layer.json        ← Multi-layer test cases (if applicable)
└── index.ts                    ← Public exports
```

### Test Utilities Location

```
test/
├── generators/
│   ├── collapse-generator.ts   ← Collapse test generator
│   ├── expand-generator.ts     ← Expand test generator
│   └── index.ts
├── schemas/
│   ├── fixture.schema.ts       ← Fixture validation schemas
│   └── index.ts
├── helpers/
│   ├── assertions.ts           ← Custom assertions
│   └── index.ts
└── setup.ts                    ← Global test setup
```

---

## Configuration

### Vitest Config

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'test/**/*.test.ts',        // Keep existing tests
      'src/**/*.test.ts',         // Add co-located tests
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/fixtures/**',           // Don't run fixtures as tests
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/fixtures/**',
        '**/index.ts',
      ],
    },
  },
});
```

### TypeScript Config

```json
// tsconfig.json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.test.ts",  // Include co-located tests
    "test/**/*.ts"
  ]
}
```

---

## Coverage Goals

### Before Migration
- 965 tests total
- ~85% coverage
- Missing edge cases

### After Migration
- 1500+ tests (estimated)
- 95% coverage target
- Comprehensive edge cases

### Coverage by Handler

Each handler should have:
- ✅ 5+ valid test cases
- ✅ 3+ invalid test cases
- ✅ 5+ edge cases
- ✅ Validation tests (new!)

---

## Examples

### Example 1: Migrating Overflow

**Before:**
```typescript
// test/collapse.test.ts (line 45-67)
test("collapses overflow with same values", () => {
  const result = collapse({
    "overflow-x": "hidden",
    "overflow-y": "hidden",
  });
  expect(result.result).toEqual({ overflow: "hidden" });
});

test("collapses overflow with different values", () => {
  const result = collapse({
    "overflow-x": "hidden",
    "overflow-y": "auto",
  });
  expect(result.result).toEqual({ overflow: "hidden auto" });
});
```

**After:**
```typescript
// src/handlers/overflow/collapse.test.ts
import { generateCollapseTests } from '@/test/generators';
import fixtures from './fixtures/collapse.json';

generateCollapseTests('overflow', fixtures);

// src/handlers/overflow/fixtures/collapse.json
{
  "name": "overflow",
  "valid": [
    {
      "description": "same values",
      "input": { "overflow-x": "hidden", "overflow-y": "hidden" },
      "expected": { "overflow": "hidden" }
    },
    {
      "description": "different values",
      "input": { "overflow-x": "hidden", "overflow-y": "auto" },
      "expected": { "overflow": "hidden auto" }
    }
  ],
  "invalid": [...],
  "edge": [...]
}
```

**Benefits:**
- ✅ Co-located with handler
- ✅ Declarative test data
- ✅ Easy to add more cases
- ✅ Edge cases added

---

## Rollout Plan

### Week 1: Infrastructure
- [ ] Create test generators
- [ ] Create fixture schemas
- [ ] Update vitest config
- [ ] Document patterns
- [ ] Create migration guide

### Week 2: Pilot (3 handlers)
- [ ] Migrate overflow
- [ ] Migrate gap  
- [ ] Migrate flex-flow
- [ ] Validate approach
- [ ] Gather feedback

### Week 3: Simple Handlers (10 handlers)
- [ ] Migrate all 2-3 longhand handlers
- [ ] Add edge case coverage
- [ ] Document learnings

### Week 4: Complex Handlers (13 handlers)
- [ ] Migrate multi-layer handlers
- [ ] Migrate grid/font/border
- [ ] Add validation tests

### Week 5: Cleanup
- [ ] Remove old test files
- [ ] Update documentation
- [ ] Measure coverage
- [ ] Celebrate! 🎉

---

## Success Metrics

### Quantitative

- ✅ All 26 handlers have co-located tests
- ✅ 95%+ code coverage
- ✅ 1500+ total tests (from 965)
- ✅ <5min CI test time
- ✅ 0 monolithic test files

### Qualitative

- ✅ "Tests are easy to find"
- ✅ "Adding tests is straightforward"
- ✅ "Edge cases are obvious"
- ✅ "PRs are easier to review"
- ✅ "Better DX when opening codebase"

---

## Open Questions

1. **Should we keep any centralized tests?**
   - Integration tests?
   - End-to-end tests?
   - Performance benchmarks?
   
   **Answer:** Yes, keep integration tests in `test/integration/`

2. **How to handle shared fixtures?**
   - Some test data applies to multiple handlers
   - Example: Global keywords (inherit, initial, etc.)
   
   **Answer:** Create `test/fixtures/common/` for shared data

3. **JSON vs TypeScript for fixtures?**
   - JSON: Simple, declarative
   - TS: Type-safe, can use functions
   
   **Answer:** JSON for data, TS for complex cases

4. **Test naming convention?**
   - `{handler}.test.ts`?
   - `{handler}.spec.ts`?
   - `{handler}.collapse.test.ts`?
   
   **Answer:** `collapse.test.ts` and `expand.test.ts` (clear separation)

---

## References

- [Vitest: In-source testing](https://vitest.dev/guide/in-source.html)
- [Testing Library: Co-location](https://kentcdodds.com/blog/colocation)
- [Jest: Fixture pattern](https://jestjs.io/docs/snapshot-testing)

---

## Related ADRs

- ADR-001: Add Object Input Support to expand()
- ADR-002: Add Context Parameter to expand()
- ADR-PENDING: Validation Strategy for collapse() (this affects edge cases!)

---

**Decision:** Approved pending pilot
**Next Steps:** 
1. Create test generators
2. Migrate overflow as pilot
3. Validate DX improvements
4. Roll out to all handlers

---

## Author's Notes

This is **exactly the right move**. Current test structure is:
- ❌ Hard to navigate (28KB files)
- ❌ Incomplete (missing edge cases)
- ❌ Disconnected (far from source)

New structure will be:
- ✅ Easy to find (next to code)
- ✅ Comprehensive (fixtures + edge cases)
- ✅ Maintainable (declarative data)
- ✅ Better DX (see tests immediately)

**The fixture-driven approach is key** - it makes adding test cases trivial (just JSON), and the generator ensures consistency across all handlers.

**Estimated impact:** 
- Development velocity: +30%
- Bug reduction: +40% 
- Code review speed: +50%
- New contributor onboarding: Much easier

This is a foundational improvement that pays dividends forever.
