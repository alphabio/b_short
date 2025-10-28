// b_path:: src/internal/parsers.ts

/**
 * Internal parsing utilities for CSS declaration processing.
 * @internal
 */

/**
 * Removes all CSS comments from the input string.
 * Uses a character-by-character scanning approach that safely handles multi-line comments.
 * @internal
 */
export function stripComments(css: string): string {
  let result = "";
  let i = 0;

  while (i < css.length) {
    if (css[i] === "/" && css[i + 1] === "*") {
      let j = i + 2;
      while (j < css.length) {
        if (css[j] === "*" && css[j + 1] === "/") {
          result += " ";
          i = j + 2;
          break;
        }
        j++;
      }
      if (j >= css.length) {
        i = css.length;
      }
    } else {
      result += css[i];
      i++;
    }
  }

  return result;
}

/**
 * Parses CSS input string into individual declarations.
 * Handles quotes, parentheses, and brackets correctly.
 * @internal
 */
export function parseInputString(input: string): string[] {
  const declarations: string[] = [];
  let current = "";
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (char === "\\" && nextChar) {
      current += char + nextChar;
      i += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      let quoteEnd = i + 1;
      while (quoteEnd < input.length) {
        if (input[quoteEnd] === char && input[quoteEnd - 1] !== "\\") {
          break;
        }
        quoteEnd++;
      }
      if (quoteEnd < input.length) {
        current += input.substring(i, quoteEnd + 1);
        i = quoteEnd + 1;
        continue;
      }
    }

    if (char === "(") {
      let parenCount = 1;
      let parenEnd = i + 1;
      while (parenEnd < input.length && parenCount > 0) {
        if (input[parenEnd] === "(") parenCount++;
        if (input[parenEnd] === ")") parenCount--;
        parenEnd++;
      }
      if (parenCount === 0) {
        current += input.substring(i, parenEnd);
        i = parenEnd;
        continue;
      }
    }

    if (char === "[") {
      const bracketEnd = input.indexOf("]", i + 1);
      if (bracketEnd !== -1) {
        current += input.substring(i, bracketEnd + 1);
        i = bracketEnd + 1;
        continue;
      }
    }

    if (char === ";") {
      declarations.push(current.trim());
      current = "";
    } else {
      current += char;
    }

    i++;
  }

  if (current.trim()) {
    declarations.push(current.trim());
  }

  return declarations.filter((decl) => decl.length > 0);
}

/**
 * Parses a CSS declaration into property and value.
 * @internal
 */
export function parseCssDeclaration(
  declaration: string
): { property: string; value: string } | null {
  const trimmed = declaration.trim();
  const colonIndex = trimmed.indexOf(":");

  if (colonIndex === -1) return null;

  const property = trimmed.slice(0, colonIndex).trim();
  const value = trimmed.slice(colonIndex + 1).trim();

  if (!property || !value) return null;

  return { property, value };
}
