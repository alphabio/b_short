# Session Handover: P1 Phase 4 - Collapse API

**Date:** 2025-11-03
**Branch:** `develop`
**Last Commit:** `a383c57` - Co-located pattern migration
**Status:** Ready for Collapse API implementation

---

## 🎯 Mission: Implement Collapse API (P1 Phase 4)

**Goal:** Reverse operation - collapse longhand properties back to shorthand values.

---

## 📋 Implementation Checklist

### **Phase 4.1: Foundation** (~2 hours) ✅ COMPLETE

- [x] Create `src/internal/collapse-handler.ts` interface
- [x] Create `src/internal/collapse-registry.ts`
- [x] Create `src/core/collapse.ts` main API
- [x] Add tests for collapse infrastructure
- [x] Implement overflow collapser (first handler)
- [x] Export from main index
- [x] **Status: 862 tests passing (852 + 10 new)**

### **Phase 4.2: Simple Handlers** (~3 hours) ✅ COMPLETE

Implement collapse for 4 remaining simple handlers:

- [x] `src/handlers/flex-flow/collapse.ts`
  - Reconstruct from `flex-direction` + `flex-wrap`

- [x] `src/handlers/place-content/collapse.ts`
  - Reconstruct from `align-content` + `justify-content`

- [x] `src/handlers/place-items/collapse.ts`
  - Reconstruct from `align-items` + `justify-items`

- [x] `src/handlers/place-self/collapse.ts`
  - Reconstruct from `align-self` + `justify-self`

- [x] Register all in collapse-registry.ts
- [x] Update each handler's `index.ts` to export collapser
- [x] Add tests for each
- [x] **Status: 875 tests passing (862 + 13 new)**

### **Phase 4.3: Medium Handlers** (~4 hours) ✅ COMPLETE

- [x] `src/handlers/columns/collapse.ts`
- [x] `src/handlers/contain-intrinsic-size/collapse.ts`
- [x] `src/handlers/list-style/collapse.ts`
- [x] `src/handlers/text-emphasis/collapse.ts`
- [x] `src/handlers/text-decoration/collapse.ts`
- [x] `src/handlers/border-radius/collapse.ts`
- [x] `src/handlers/outline/collapse.ts`
- [x] `src/handlers/column-rule/collapse.ts`
- [x] `src/handlers/grid-column/collapse.ts`
- [x] `src/handlers/grid-row/collapse.ts`
- [x] `src/handlers/grid-area/collapse.ts`
- [x] Register all + tests
- [x] Fixed hierarchical shorthand priority (grid-area > grid-column/row)
- [x] Added CSS string input support
- [x] Added issue reporting system (matches expand API pattern)
- [x] **Status: 892 tests passing (888 + 4 new)**

### **Phase 4.4: Complex Handlers** (~4 hours) 🔄 NEXT - Font Priority

**Note:** These can be partial/best-effort implementations.

**Priority: Font Handler** - Start with this one as it establishes patterns for complex handlers.

- [ ] `src/handlers/font/collapse.ts` (complex state machine - HIGH PRIORITY)
  - Complex syntax: `font: [style] [variant] [weight] [stretch] size[/line-height] family`
  - Challenge: Order-dependent keywords, optional values, required size+family
  - Reference: `src/handlers/font/expand.ts` for parsing logic (borrowed from css-font-parser)
  - Longhands: font-style, font-variant, font-weight, font-stretch, font-size, line-height, font-family
  - System fonts: caption, icon, menu, message-box, small-caption, status-bar
  - Note: font-family can be comma-separated list with quotes
  
**Font Collapse Strategy:**
1. Check if all required properties present (font-size, font-family)
2. Build shorthand in correct order: [style] [variant] [weight] [stretch] size[/line-height] family
3. Handle system fonts as special case (single keyword)
4. Report incomplete-longhands issue if size or family missing
5. Consider best-effort: if no optional values, just output "size family"

Then optionally continue with:

- [ ] `src/handlers/flex/collapse.ts`
- [ ] `src/handlers/border/collapse.ts` (hierarchical)
- [ ] `src/handlers/animation/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/background/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/transition/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/mask/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/grid/collapse.ts` (template syntax - optional)
- [ ] `src/handlers/offset/collapse.ts` (path syntax - optional)

### **Phase 4.5: Integration & Polish** (~2 hours)

- [ ] Export `collapse` from `src/index.ts`
- [ ] Export `CollapseHandler` type
- [ ] Export `collapseRegistry` (optional)
- [ ] Add comprehensive integration tests
- [ ] Document collapse API in README
- [ ] Add usage examples
- [ ] Performance benchmarks
- [ ] Build verification
- [ ] All tests passing

---

## 🏗️ Key Architecture Decisions

### **1. Separate Concerns**

- Expand logic: `expand.ts` (unchanged)
- Collapse logic: `collapse.ts` (new)
- Co-located in same handler directory

### **2. Optional by Handler**

- Not all handlers need collapse
- Start with simple ones
- Complex handlers can be added later

### **3. Smart Collapse Algorithm**

```typescript
// src/core/collapse.ts pseudo-code
function collapse(properties: Record<string, string>): Record<string, string> {
  // 1. Group longhands by potential shorthands (use registry)
  // 2. For each group, try to collapse
  // 3. If successful, use shorthand value
  // 4. If not, keep longhands
  // 5. Return optimized mix
}
```

### **4. Validation**

- `canCollapse()` checks if properties are collapsible
- `collapse()` returns `undefined` if impossible
- Prefer shorthands when all longhands present

---

## 📂 File Structure

```
src/
├── core/
│   ├── expand.ts           ✅ Existing
│   ├── collapse.ts         📝 New - Main API
│   ├── validate.ts         ✅ Existing
│   └── schema.ts           ✅ Existing
├── internal/
│   ├── property-handler.ts       ✅ Existing
│   ├── handler-registry.ts       ✅ Existing
│   ├── collapse-handler.ts       📝 New - Interface
│   └── collapse-registry.ts      📝 New - Registry
└── handlers/
    ├── overflow/
    │   ├── expand.ts       ✅ Existing
    │   ├── collapse.ts     📝 New
    │   └── index.ts        ✅ Existing (update to export collapser)
    └── [24 more handlers]
```

---

## 🧪 Testing Strategy

1. **Unit Tests:** Each collapse.ts has own tests
2. **Integration Tests:** Test collapse() with full property sets
3. **Round-trip Tests:** expand() → collapse() should be identity
4. **Edge Cases:** Missing properties, invalid values, partial sets

---

## 🎯 Success Criteria

- [x] At least 10 handlers with collapse support (✅ 16 handlers implemented)
- [x] Main collapse() API working
- [x] All existing tests still passing (852)
- [x] New collapse tests passing
- [x] Build successful
- [x] Exported from main index.ts
- [x] Issue reporting system implemented
- [x] CSS string input support
- [ ] Documentation complete
- [ ] Performance benchmarks

---

## 📊 Progress Summary

**Completed:**
- ✅ Phase 4.1: Foundation (862 tests)
- ✅ Phase 4.2: Simple Handlers (875 tests)
- ✅ Phase 4.3: Medium Handlers (892 tests)

**Total Handlers Implemented:** 16
1. overflow
2. flex-flow
3. place-content
4. place-items
5. place-self
6. columns
7. contain-intrinsic-size
8. list-style
9. text-emphasis
10. text-decoration
11. border-radius
12. outline
13. column-rule
14. grid-column
15. grid-row
16. grid-area

**Key Achievements:**
- ✅ Implemented hierarchical shorthand priority system
- ✅ Fixed grid-area/grid-column/grid-row conflict resolution
- ✅ Added CSS string input support
- ✅ Implemented issue reporting (matches expand API pattern)
- ✅ All 892 tests passing
- ✅ Build successful
- ✅ Code linted and formatted

**API Pattern Established:**
```typescript
interface CollapseResult {
  ok: boolean;
  result?: Record<string, string> | string;
  issues: BStyleWarning[];
}
```

**Next Phase:** 4.4 - Font Handler (Complex Property)

---

## 📊 Estimated Time: 12-15 hours

- Foundation: 2h ✅
- Simple handlers: 3h ✅
- Medium handlers: 4h ✅
- Complex handlers: 4h 🔄
- Integration: 2h ⏳

---

## 🚀 Quick Start for Next Session

```bash
cd /Users/alphab/Dev/LLM/DEV/b_short

# Review font expand handler to understand structure
cat src/handlers/font/expand.ts

# Create font collapse handler
# Key challenges:
# 1. Reconstruct order-dependent syntax
# 2. Handle optional values (style, variant, weight, stretch)
# 3. Parse line-height from size (e.g., "16px/1.5")
# 4. Ensure size and family are present (required)
# 5. Handle system fonts (caption, icon, menu, etc.)

# Example collapse scenarios:
# Input: { font-size: '16px', font-family: 'Arial' }
# Output: { font: '16px Arial' }

# Input: { font-style: 'italic', font-weight: 'bold', font-size: '16px', font-family: 'Arial' }
# Output: { font: 'italic bold 16px Arial' }

# Run tests frequently
npm test

# Pattern to follow from existing handlers:
# 1. Create src/handlers/font/collapse.ts
# 2. Export from src/handlers/font/index.ts
# 3. Register in src/internal/collapse-registry.ts
# 4. Add tests to test/collapse.test.ts
# 5. Use issue reporting for incomplete longhands
```

---

**Session Completed:** 2025-11-03
**Next Agent:** Implement font collapse handler (Phase 4.4) - establishes pattern for complex properties
