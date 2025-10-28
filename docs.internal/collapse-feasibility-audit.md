# 🔍 Audit: longhand-to-shorthand (collapse) Implementation

## Executive Summary

**Goal**: Implement `collapse()` - the inverse of `expand()` that takes longhand CSS properties and combines them into shorthands.

---

## 📊 Complexity Analysis by Property Category

### 🟢 **LOW COMPLEXITY** (Quick Wins)

#### 1. **Directional Properties** (margin, padding, inset, border-radius)
**Effort**: 1-2 days  
**Complexity**: ⭐ (Very Low)

**Why Easy**:
- Simple value matching across 4 sides
- Already have `directional()` logic - just reverse it
- No complex parsing, just check if values match patterns:
  - All same → `margin: 10px`
  - Top/bottom same, left/right same → `margin: 10px 20px`
  - Top different, sides same, bottom different → `margin: 10px 20px 30px`
  - All different → `margin: 10px 20px 30px 40px`

**Example**:
\`\`\`typescript
// Input
{ marginTop: '10px', marginRight: '10px', marginBottom: '10px', marginLeft: '10px' }
// Output
{ margin: '10px' }
\`\`\`

**Quick Win**: ✅ Yes - Can implement in a few hours

---

#### 2. **Border Width/Style/Color Shorthands**
**Effort**: 1-2 days  
**Complexity**: ⭐⭐ (Low)

**Why Moderate**:
- Need to check 4 sides for each property (width, style, color)
- Can collapse to `border-width`, `border-style`, `border-color`
- Then potentially collapse those three into single `border`

**Collapsing Strategy**:
1. Check if all 4 sides have same width/style/color
2. If yes, use shorthand
3. If width + style + color all uniform, collapse to `border: 1px solid red`

**Quick Win**: ✅ Yes

---

### 🟡 **MEDIUM COMPLEXITY**

#### 3. **Flex & Flex-Flow**
**Effort**: 2-3 days  
**Complexity**: ⭐⭐⭐ (Medium)

**Why Moderate**:
- `flex-grow`, `flex-shrink`, `flex-basis` → `flex: 1 1 auto`
- Need to handle defaults correctly
- `flex-direction` + `flex-wrap` → `flex-flow: row wrap`

**Collapsing Logic**:
\`\`\`typescript
if (flexGrow === '0' && flexShrink === '1' && flexBasis === 'auto') {
  return { flex: 'none' };
}
if (flexGrow === '1' && flexShrink === '1' && flexBasis === '0%') {
  return { flex: '1' };
}
\`\`\`

**Quick Win**: 🤔 Maybe - Doable but needs careful default handling

---

#### 4. **Overflow**
**Effort**: 1 day  
**Complexity**: ⭐⭐ (Low)

**Why Easy**:
- Just check if `overflow-x === overflow-y`
- If same, use `overflow: value`

**Quick Win**: ✅ Yes

---

#### 5. **Place Shorthands** (place-content, place-items, place-self)
**Effort**: 1-2 days  
**Complexity**: ⭐⭐ (Low-Medium)

**Why Moderate**:
- `align-content` + `justify-content` → `place-content`
- Need to handle single vs dual value syntax
- Watch for keywords that can't be combined

**Quick Win**: ✅ Yes

---

### 🔴 **HIGH COMPLEXITY**

#### 6. **Background** (Multi-layer)
**Effort**: 1-2 weeks  
**Complexity**: ⭐⭐⭐⭐⭐ (Very High)

**Why Hard**:
- Multi-layer support (7 properties × N layers)
- Need to reconstruct layer syntax correctly
- Handle `background-color` separately (only appears once)
- Complex serialization: \`url() position / size repeat attachment origin clip\`
- Must handle defaults intelligently (don't output if default)

**Challenges**:
1. Detect which properties belong to which layer
2. Serialize each layer correctly
3. Handle color (only in final layer or standalone)
4. Minimize output (omit defaults)

**Example**:
\`\`\`typescript
// Input (2 layers)
{
  backgroundImage: 'url(a.png), url(b.png)',
  backgroundPosition: '10px 20px, center',
  backgroundSize: 'cover, auto',
  // ... more properties
  backgroundColor: 'red'
}
// Output
'background: url(a.png) 10px 20px / cover, url(b.png) center red;'
\`\`\`

**Quick Win**: ❌ No - This is a major project

---

#### 7. **Animation & Transition** (Multi-layer)
**Effort**: 1-2 weeks  
**Complexity**: ⭐⭐⭐⭐⭐ (Very High)

**Why Hard**:
- 8 animation properties × N layers
- 4 transition properties × N layers
- Complex value serialization
- Keyword ordering matters

**Quick Win**: ❌ No

---

#### 8. **Mask** (Multi-layer)
**Effort**: 1-2 weeks  
**Complexity**: ⭐⭐⭐⭐⭐ (Very High)

**Why Hard**:
- Similar to background but with 8 properties
- Less common, less tested in the wild

**Quick Win**: ❌ No

---

#### 9. **Font**
**Effort**: 3-5 days  
**Complexity**: ⭐⭐⭐⭐ (High)

**Why Hard**:
- Complex syntax: \`style variant weight stretch size/line-height family\`
- Many optional parts
- Order matters
- System font keywords (\`caption\`, \`icon\`, etc.)

**Quick Win**: ❌ No

---

#### 10. **Grid**
**Effort**: 1-2 weeks  
**Complexity**: ⭐⭐⭐⭐⭐ (Very High)

**Why Hard**:
- Extremely complex syntax variations
- Template areas, auto-flow, gaps
- Multiple collapse patterns possible
- Would need extensive testing

**Quick Win**: ❌ No

---

## 🎯 **Quick Win Strategy**

### Phase 1: Low-Hanging Fruit (1-2 weeks)
1. ✅ **Directional properties** (margin, padding, inset, border-radius)
2. ✅ **Overflow**
3. ✅ **Place shorthands**
4. ✅ **Border width/style/color**

**ROI**: ~40-50% of common use cases covered

---

### Phase 2: Medium Complexity (2-3 weeks)
5. **Flex & flex-flow**
6. **Text-decoration**
7. **Text-emphasis**
8. **List-style**
9. **Outline**
10. **Column-rule**
11. **Columns**

**ROI**: ~70-80% of use cases covered

---

### Phase 3: High Complexity (1-3 months)
12. **Background** (multi-layer)
13. **Animation** (multi-layer)
14. **Transition** (multi-layer)
15. **Font**
16. **Grid**
17. **Mask** (multi-layer)

**ROI**: 95-100% complete

---

## 🏗️ **Architecture Considerations**

### Input Format
\`\`\`typescript
interface CollapseOptions {
  format?: 'css' | 'js';  // Input format
  aggressive?: boolean;    // Collapse even if not all longhands present?
  prefer?: 'shorthand' | 'longhand';  // When in doubt
}

function collapse(properties: Record<string, string>, options?: CollapseOptions): string | Record<string, string>
\`\`\`

### Core Algorithm
\`\`\`typescript
function collapse(props: Record<string, string>): Record<string, string> {
  const result = { ...props };
  
  // Try collapsing in order of specificity (most specific first)
  tryCollapseMargin(result);
  tryCollapsePadding(result);
  tryCollapseBorder(result);
  tryCollapseBackground(result);
  // ... etc
  
  return result;
}
\`\`\`

### Key Challenges

1. **Detecting Collapsible Sets**
   - Not all 4 sides may be present
   - Partial collapse? (e.g., just top/bottom)

2. **Default Value Handling**
   - Should \`margin-top: 0; margin-right: 0\` collapse to \`margin: 0\`?
   - Or leave as longhands if not complete?

3. **Preference Conflicts**
   - What if user wants both \`margin: 10px\` AND \`margin-top: 20px\`?
   - Last-wins? Error? Warning?

4. **Ordering**
   - Collapsed shorthands should appear at position of first longhand
   - Or always at the beginning?

---

## 📈 **ROI Assessment**

### High-Value, Low-Effort (IMPLEMENT FIRST)

| Property | Effort | Value | Priority |
|----------|--------|-------|----------|
| margin | 1 day | ⭐⭐⭐⭐⭐ | 🔥 P0 |
| padding | 1 day | ⭐⭐⭐⭐⭐ | 🔥 P0 |
| border-width/style/color | 2 days | ⭐⭐⭐⭐ | 🔥 P0 |
| overflow | 4 hours | ⭐⭐⭐ | P1 |
| place-* | 1 day | ⭐⭐⭐ | P1 |
| border-radius | 1 day | ⭐⭐⭐⭐ | P1 |
| inset | 1 day | ⭐⭐⭐ | P2 |

**Total**: ~1-2 weeks for 70% of common use cases

---

### Medium-Value, Medium-Effort

| Property | Effort | Value | Priority |
|----------|--------|-------|----------|
| flex | 2 days | ⭐⭐⭐⭐ | P2 |
| flex-flow | 1 day | ⭐⭐⭐ | P2 |
| text-decoration | 1 day | ⭐⭐⭐ | P3 |
| outline | 1 day | ⭐⭐ | P3 |

**Total**: ~1 week for additional 15% coverage

---

### Low-Value, High-Effort (DO LAST)

| Property | Effort | Value | Priority |
|----------|--------|-------|----------|
| background | 2 weeks | ⭐⭐⭐⭐ | P4 |
| animation | 2 weeks | ⭐⭐⭐ | P4 |
| transition | 1 week | ⭐⭐⭐⭐ | P3 |
| font | 1 week | ⭐⭐ | P5 |
| grid | 2 weeks | ⭐⭐ | P5 |
| mask | 2 weeks | ⭐ | P6 |

**Total**: 2-3 months for final 15%

---

## 🎬 **Recommended Approach**

### MVP (Minimum Viable Product) - 1-2 weeks
Focus on **directional properties** only:
- margin, padding, inset, border-radius
- overflow
- place-content, place-items, place-self

**Why**: 
- Covers majority of real-world optimization needs
- Simple, testable, low-risk
- Fast time-to-value

### Iteration 2 - 2-3 weeks
Add medium-complexity shorthands:
- border (width/style/color)
- flex + flex-flow
- text-decoration, outline, column-rule, etc.

### Iteration 3+ (Optional) - 2-3 months
Multi-layer properties if there's strong demand.

---

## 🚨 **Key Risks & Mitigations**

### Risk 1: Incomplete Longhand Sets
**Problem**: User only provides 2 of 4 margin sides  
**Mitigation**: 
- Option: \`aggressive: false\` (default) - don't collapse
- Option: \`aggressive: true\` - fill in defaults and collapse

### Risk 2: Conflicts with User Intent
**Problem**: User explicitly wants longhands for specificity  
**Mitigation**:
- Add \`skipCollapse: string[]\` option to preserve certain properties
- Document clearly when collapse happens

### Risk 3: Complex Multi-Layer Properties
**Problem**: Background, animation, etc. are very complex  
**Mitigation**:
- Defer to later iteration
- Focus on high-ROI simple properties first

### Risk 4: Browser Compatibility
**Problem**: Some shorthands have nuanced browser support  
**Mitigation**:
- Document which shorthands are supported
- Add \`minify: boolean\` option to control aggressiveness

---

## 💡 **Recommendation**

### ✅ **YES, implement collapse() - but strategically**

**Phase 1 (Quick Win)**: 
- Start with directional properties (margin, padding, inset, border-radius)
- Add overflow, place-* shorthands
- **Deliverable**: Useful optimization for 70% of cases
- **Time**: 1-2 weeks
- **ROI**: High

**Phase 2 (If successful)**:
- Add flex, border, text-decoration
- **Time**: +2-3 weeks
- **ROI**: Medium

**Phase 3 (Enterprise feature)**:
- Multi-layer properties (background, animation, transition)
- **Time**: +2-3 months
- **ROI**: Low (diminishing returns)

---

## 📝 **Next Steps**

1. ✅ Validate demand (user feedback, GitHub issues)
2. ✅ Prototype directional property collapse (2-3 days)
3. ✅ Add comprehensive tests
4. ✅ Document behavior clearly
5. ✅ Release as **experimental feature**
6. 📊 Measure adoption/feedback
7. 🔄 Iterate based on data

---

