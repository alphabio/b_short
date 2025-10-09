// b_path:: src/grid-line.ts

export function isCustomIdent(s: string): boolean {
  return /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(s);
}

function isInteger(s: string): boolean {
  return /^[+-]?[0-9]+$/.test(s) && Number(s) !== 0;
}

export function parseGridLine(value: string): boolean {
  const tokens = value.trim().split(/\s+/);
  if (tokens.length === 0) return false;

  if (tokens[0] === "span") {
    if (tokens.length < 2 || tokens.length > 3) return false;
    const rest = tokens.slice(1);
    let seenInt = false;
    let seenIdent = false;
    for (const token of rest) {
      if (isInteger(token)) {
        if (seenInt) return false;
        seenInt = true;
      } else if (isCustomIdent(token)) {
        if (seenIdent) return false;
        seenIdent = true;
      } else {
        return false;
      }
    }
    return seenInt || seenIdent;
  } else {
    if (tokens.length > 2) return false;
    let seenInt = false;
    let seenIdent = false;
    for (const token of tokens) {
      if (isInteger(token)) {
        if (seenInt) return false;
        seenInt = true;
      } else if (isCustomIdent(token)) {
        if (seenIdent) return false;
        seenIdent = true;
      } else {
        return false;
      }
    }
    return seenInt || seenIdent;
  }
}

export function getDefaultEnd(start: string): string {
  return isCustomIdent(start) ? start : "auto";
}
