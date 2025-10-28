# 🎯 collapse() - Executive Summary

## TL;DR

**✅ YES - There's a GREAT quick win opportunity!**

- **Phase 1**: 1-2 weeks for 70% of use cases (directional properties)
- **Prototype**: Already working (took 15 minutes)
- **ROI**: High - margin/padding/border-radius are most commonly minified
- **Risk**: Low - simple logic, easy to test

---

## 📊 The Numbers

| Complexity | Properties | Effort | Coverage | Priority |
|------------|-----------|--------|----------|----------|
| 🟢 **LOW** | margin, padding, inset, border-radius, overflow, place-* | 1-2 weeks | 70% | 🔥 DO FIRST |
| 🟡 **MEDIUM** | flex, flex-flow, text-decoration, outline, column-rule | 2-3 weeks | +15% | Later |
| 🔴 **HIGH** | background, animation, transition, font, grid, mask | 2-3 months | +15% | Much later |

---

## 💰 Quick Win Strategy

### MVP Implementation (1-2 weeks)

```typescript
function collapse(properties: Record<string, string>): Record<string, string>
```

**Supports**:
- ✅ `margin` (top/right/bottom/left → margin)
- ✅ `padding` (top/right/bottom/left → padding)  
- ✅ `border-radius` (4 corners → border-radius)
- ✅ `inset` (top/right/bottom/left → inset)
- ✅ `overflow` (x/y → overflow)
- ✅ `place-content` (align-content + justify-content)
- ✅ `place-items` (align-items + justify-items)
- ✅ `place-self` (align-self + justify-self)

**Example**:
```typescript
collapse({
  marginTop: '10px',
  marginRight: '10px', 
  marginBottom: '10px',
  marginLeft: '10px'
})
// → { margin: '10px' }
```

---

## 🏗️ Implementation Plan

### Week 1: Core Infrastructure
- [ ] Create `collapse()` function signature
- [ ] Implement directional property collapser (margin, padding, inset, border-radius)
- [ ] Add Zod schemas for options
- [ ] Write 100+ tests

### Week 2: Additional Quick Wins
- [ ] Implement overflow
- [ ] Implement place-* shorthands
- [ ] Add integration tests
- [ ] Documentation
- [ ] Release as `v3.0.0` with **experimental** flag

---

## 🎨 API Design

```typescript
interface CollapseOptions {
  format?: 'css' | 'js';        // Input/output format
  aggressive?: boolean;          // Collapse incomplete sets? (default: false)
  skipProperties?: string[];     // Properties to never collapse
}

// Basic usage
collapse({ marginTop: '10px', marginRight: '10px', ... })
// → { margin: '10px' }

// With options
collapse(props, { 
  aggressive: true,    // Collapse even if not all 4 sides present
  skipProperties: ['margin']  // Keep margin expanded
})
```

---

## ⚠️ Key Decisions Needed

### 1. Incomplete Sets
**Q**: What if user only provides 3 of 4 sides?
```typescript
{ marginTop: '10px', marginRight: '10px', marginBottom: '10px' }
// Missing marginLeft
```

**Options**:
- A) Don't collapse (default) ✅ **RECOMMENDED**
- B) Fill with default (`0`) and collapse
- C) Partial shorthand: `margin: 10px 10px 10px 0`

### 2. Naming
**Q**: What should the function be called?

**Options**:
- `collapse()` ✅ **RECOMMENDED** - Simple, opposite of expand
- `minify()` - CSS minification connotation
- `compact()` - Less clear
- `toLonghand()` / `toShorthand()` - More explicit but verbose

### 3. Positioning
**Q**: Where does collapsed property appear?

```typescript
{ color: 'red', marginTop: '10px', marginRight: '10px', ... }
//               ↑ First margin property position
```

**Options**:
- A) Replace first longhand position ✅ **RECOMMENDED**
- B) Always at beginning
- C) Always at end

---

## 📈 Success Metrics

After MVP release, measure:
- **Adoption rate**: % of users calling `collapse()`
- **Properties collapsed**: Which properties are most used?
- **Issues/bugs**: Edge cases we missed
- **Performance**: Speed compared to manual CSS minification

**Decision point**: If adoption > 30%, proceed to Phase 2 (flex, border, etc.)

---

## 🚦 Go/No-Go Recommendation

### ✅ **GO** - with phased approach

**Why**:
1. 📊 **High demand**: CSS minification is common need
2. ⚡ **Quick win**: 70% of value in 1-2 weeks
3. 🔬 **Low risk**: Simple algorithm, easy to test
4. 🎯 **Clear path**: Can iterate based on feedback

**Caution**:
- Don't over-invest in complex multi-layer properties initially
- Release as **experimental** to set expectations
- Gather real-world feedback before Phase 2

---

## 📚 Related Resources

- **Full Audit**: `docs.internal/collapse-feasibility-audit.md`
- **Prototype**: `docs.internal/collapse-prototype.ts`
- **Complexity Analysis**: See audit document for detailed breakdown

---

## 🎬 Next Steps

1. **Get approval** for 1-2 week MVP sprint
2. **Create GitHub issue** to track feature
3. **Start with tests** (TDD approach)
4. **Implement directional properties** first
5. **Release as experimental** feature
6. **Gather feedback** for 2-4 weeks
7. **Decide on Phase 2** based on data

---

**Bottom line**: This is a **high-value, low-effort** feature that fits perfectly with your existing `expand()` functionality. Strongly recommend implementing Phase 1.
