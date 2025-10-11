// b_path:: src/flex.ts
import isLength from "./is-length";

export default function (value: string): Record<string, string> | undefined {
  // Handle global CSS keywords
  if (/^(inherit|unset|revert)$/i.test(value)) {
    return {
      "flex-grow": value,
      "flex-shrink": value,
      "flex-basis": value,
    };
  }

  // Special case for initial
  if (value === "initial") {
    return {
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "auto",
    };
  }

  // Handle special keyword values
  if (value === "none") {
    return {
      "flex-grow": "0",
      "flex-shrink": "0",
      "flex-basis": "auto",
    };
  }

  if (value === "auto") {
    return {
      "flex-grow": "1",
      "flex-shrink": "1",
      "flex-basis": "auto",
    };
  }

  // Parse normal values
  const parts = value.trim().split(/\s+/);
  if (parts.length > 3 || parts.length === 0) return undefined;

  // Define value type detection patterns
  const numberPattern = /^[+-]?([0-9]*\.)?[0-9]+$/;
  const flexBasisKeywordPattern = /^(auto|content|max-content|min-content|fit-content)$/i;
  const fitContentFn = /^fit-content\(\s*[^)]+\s*\)$/i;

  // Classify each value by type
  const classified: Array<{ value: string; type: "number" | "basis" }> = [];
  for (const part of parts) {
    if (numberPattern.test(part)) {
      classified.push({ value: part, type: "number" });
    } else if (flexBasisKeywordPattern.test(part) || isLength(part) || fitContentFn.test(part)) {
      classified.push({ value: part, type: "basis" });
    } else {
      return undefined;
    }
  }

  // Handle unitless zero as basis in three-value form
  if (classified.length === 3 && classified[2].type === "number" && isLength(classified[2].value)) {
    classified[2] = { type: "basis", value: classified[2].value };
  }

  // Apply expansion rules based on value count
  if (classified.length === 1) {
    const [val] = classified;
    if (val.type === "number") {
      return {
        "flex-grow": val.value,
        "flex-shrink": "1",
        "flex-basis": "0%",
      };
    } else {
      return {
        "flex-grow": "1",
        "flex-shrink": "1",
        "flex-basis": val.value,
      };
    }
  } else if (classified.length === 2) {
    const [first, second] = classified;
    if (first.type === "number" && second.type === "number") {
      return {
        "flex-grow": first.value,
        "flex-shrink": second.value,
        "flex-basis": "0%",
      };
    } else if (first.type === "number" && second.type === "basis") {
      return {
        "flex-grow": first.value,
        "flex-shrink": "1",
        "flex-basis": second.value,
      };
    } else if (first.type === "basis" && second.type === "number") {
      return {
        "flex-grow": second.value,
        "flex-shrink": "1",
        "flex-basis": first.value,
      };
    } else {
      return undefined;
    }
  } else if (classified.length === 3) {
    const [first, second, third] = classified;
    if (first.type === "number" && second.type === "number" && third.type === "basis") {
      return {
        "flex-grow": first.value,
        "flex-shrink": second.value,
        "flex-basis": third.value,
      };
    } else {
      return undefined;
    }
  }

  return undefined;
}
