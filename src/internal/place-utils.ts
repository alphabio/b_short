// b_path:: src/internal/place-utils.ts
export function consolidatePlaceTokens(
  value: string,
  nextTokenPattern: RegExp
): string[] | undefined {
  const tokens = value.trim().split(/\s+/);
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (/^(first|last)$/i.test(t) && i + 1 < tokens.length && /^baseline$/i.test(tokens[i + 1])) {
      out.push(`${tokens[i]} ${tokens[i + 1]}`);
      i++;
      continue;
    }
    if (
      /^(safe|unsafe)$/i.test(t) &&
      i + 1 < tokens.length &&
      nextTokenPattern.test(tokens[i + 1])
    ) {
      out.push(`${tokens[i]} ${tokens[i + 1]}`);
      i++;
      continue;
    }
    out.push(t);
  }
  return out.length <= 2 ? out : undefined;
}
