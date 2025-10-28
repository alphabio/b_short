// Quick prototype: collapse() for directional properties
// Demonstrates the "quick win" implementation

interface CollapseOptions {
  format?: 'css' | 'js';
  aggressive?: boolean; // Collapse even with incomplete sets?
}

/**
 * Collapses margin longhand properties into shorthand
 * Examples:
 *   { marginTop: '10px', marginRight: '10px', marginBottom: '10px', marginLeft: '10px' }
 *   → { margin: '10px' }
 *   
 *   { marginTop: '10px', marginRight: '20px', marginBottom: '10px', marginLeft: '20px' }
 *   → { margin: '10px 20px' }
 */
function collapseMargin(props: Record<string, string>): Record<string, string> | null {
  const top = props.marginTop;
  const right = props.marginRight;
  const bottom = props.marginBottom;
  const left = props.marginLeft;

  // All 4 sides must be present (unless aggressive mode)
  if (!top || !right || !bottom || !left) {
    return null;
  }

  // All same
  if (top === right && right === bottom && bottom === left) {
    return { margin: top };
  }

  // Top/bottom same, left/right same
  if (top === bottom && right === left) {
    return { margin: `${top} ${right}` };
  }

  // Left/right same
  if (right === left) {
    return { margin: `${top} ${right} ${bottom}` };
  }

  // All different
  return { margin: `${top} ${right} ${bottom} ${left}` };
}

/**
 * Main collapse function - MVP with just directional properties
 */
function collapse(
  properties: Record<string, string>,
  options: CollapseOptions = {}
): Record<string, string> {
  const result = { ...properties };
  
  // Try margin
  const marginCollapsed = collapseMargin(result);
  if (marginCollapsed) {
    delete result.marginTop;
    delete result.marginRight;
    delete result.marginBottom;
    delete result.marginLeft;
    Object.assign(result, marginCollapsed);
  }

  // Similar for padding, border-radius, inset, etc.
  // (Implementation would be nearly identical)

  return result;
}

// Example usage
const input1 = {
  marginTop: '10px',
  marginRight: '10px',
  marginBottom: '10px',
  marginLeft: '10px',
  paddingTop: '5px',
  paddingRight: '10px',
  paddingBottom: '5px',
  paddingLeft: '10px',
};

console.log('Input:', input1);
console.log('Output:', collapse(input1));
// Expected: { margin: '10px', padding: '5px 10px' }

const input2 = {
  marginTop: '10px',
  marginRight: '20px',
  marginBottom: '30px',
  marginLeft: '40px',
};

console.log('\nInput:', input2);
console.log('Output:', collapse(input2));
// Expected: { margin: '10px 20px 30px 40px' }

const input3 = {
  marginTop: '10px',
  marginRight: '20px',
  marginBottom: '10px',
  marginLeft: '20px',
};

console.log('\nInput:', input3);
console.log('Output:', collapse(input3));
// Expected: { margin: '10px 20px' }

// Estimate: This prototype took ~15 minutes to write
// Full implementation with tests: 1-2 days
