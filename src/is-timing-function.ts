// b_path:: src/is-timing-function.ts
// Utility to detect CSS timing function values for transition-timing-function parsing
const TIMING_KEYWORDS = /^(ease|linear|ease-in|ease-out|ease-in-out|step-start|step-end)$/i;
const TIMING_FUNCTIONS = /^(cubic-bezier|steps)\s*\(/i;

function hasBalancedParentheses(value: string): boolean {
  let openCount = 0;
  for (const char of value) {
    if (char === "(") {
      openCount++;
    } else if (char === ")") {
      openCount--;
      if (openCount < 0) {
        return false;
      }
    }
  }
  return openCount === 0;
}

export default function isTimingFunction(value: string): boolean {
  // Check for timing function keywords
  if (TIMING_KEYWORDS.test(value)) {
    return true;
  }

  // Check for timing function functions with balanced parentheses
  if (TIMING_FUNCTIONS.test(value)) {
    return hasBalancedParentheses(value);
  }

  return false;
}
