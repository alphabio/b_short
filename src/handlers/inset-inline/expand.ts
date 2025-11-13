// b_path:: src/handlers/inset-inline/expand.ts

export function expandInsetInline(value: string): Record<string, string> {
  const trimmed = value.trim();

  // Global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert"
  ) {
    return {
      "inset-inline-start": trimmed,
      "inset-inline-end": trimmed,
    };
  }

  const parts = trimmed.split(/\s+/).filter((p) => p);

  if (parts.length === 1) {
    return {
      "inset-inline-start": parts[0],
      "inset-inline-end": parts[0],
    };
  }

  // 2 values: start end
  return {
    "inset-inline-start": parts[0],
    "inset-inline-end": parts[1],
  };
}
