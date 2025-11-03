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

### **Phase 4.1: Foundation** (~2 hours)

- [ ] Create `src/internal/collapse-handler.ts` interface

  ```typescript
  export interface CollapseHandler {
    readonly meta: {
      shorthand: string;
      longhands: string[];
    };
    collapse(properties: Record<string, string>): string | undefined;
    canCollapse(properties: Record<string, string>): boolean;
  }
  ```

- [ ] Create `src/internal/collapse-registry.ts`
  - Map of shorthand → CollapseHandler
  - Export `collapseRegistry`

- [ ] Create `src/core/collapse.ts` main API

  ```typescript
  export function collapse(properties: Record<string, string>): Record<string, string>
  ```

  - Smart algorithm: try to collapse compatible property groups
  - Return mix of shorthands + remaining longhands

- [ ] Add tests for collapse infrastructure
  - Test collapse registry
  - Test main collapse() function with simple cases

### **Phase 4.2: Simple Handlers** (~3 hours)

Implement collapse for 5 simple handlers:

- [ ] `src/handlers/overflow/collapse.ts`
  - If `overflow-x` === `overflow-y` → single value
  - Else → two values

- [ ] `src/handlers/flex-flow/collapse.ts`
  - Reconstruct from `flex-direction` + `flex-wrap`

- [ ] `src/handlers/place-content/collapse.ts`
  - Reconstruct from `align-content` + `justify-content`

- [ ] `src/handlers/place-items/collapse.ts`
  - Reconstruct from `align-items` + `justify-items`

- [ ] `src/handlers/place-self/collapse.ts`
  - Reconstruct from `align-self` + `justify-self`

- [ ] Update each handler's `index.ts` to export collapser
- [ ] Register in collapse-registry.ts
- [ ] Add tests for each

### **Phase 4.3: Medium Handlers** (~4 hours)

- [ ] `src/handlers/columns/collapse.ts`
- [ ] `src/handlers/contain-intrinsic-size/collapse.ts`
- [ ] `src/handlers/list-style/collapse.ts`
- [ ] `src/handlers/text-emphasis/collapse.ts`
- [ ] `src/handlers/text-decoration/collapse.ts`
- [ ] `src/handlers/border-radius/collapse.ts`
- [ ] `src/handlers/outline/collapse.ts`
- [ ] `src/handlers/column-rule/collapse.ts`
- [ ] `src/handlers/grid-column/collapse.ts`
- [ ] `src/handlers/grid-row/collapse.ts`
- [ ] `src/handlers/grid-area/collapse.ts`

Register all + tests.

### **Phase 4.4: Complex Handlers** (~4 hours)

**Note:** These can be partial/best-effort implementations.

- [ ] `src/handlers/flex/collapse.ts`
- [ ] `src/handlers/border/collapse.ts` (hierarchical)
- [ ] `src/handlers/animation/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/background/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/transition/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/mask/collapse.ts` (multi-layer - optional)
- [ ] `src/handlers/font/collapse.ts` (complex state machine - optional)
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

- [ ] At least 10 handlers with collapse support
- [ ] Main collapse() API working
- [ ] All existing tests still passing (852)
- [ ] New collapse tests passing
- [ ] Build successful
- [ ] Exported from main index.ts
- [ ] Documentation complete

---

## 📊 Estimated Time: 12-15 hours

- Foundation: 2h
- Simple handlers: 3h
- Medium handlers: 4h
- Complex handlers: 4h
- Integration: 2h

---

## 🚀 Quick Start

```bash
# Start with foundation
cd /Users/alphab/Dev/LLM/DEV/b_short

# Create collapse-handler.ts interface
# Create collapse-registry.ts
# Create core/collapse.ts main API
# Add tests

# Then implement handlers one by one
# Starting with overflow (simplest)
```

---

**Next Agent:** Start with Phase 4.1 - create foundation interfaces and main collapse API.
