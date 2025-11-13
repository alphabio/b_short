// b_path:: src/handlers/inset-block/expand.ts

export function expandInsetBlock(value: string): Record<string, string> {
  const trimmed = value.trim();

  // Global values
  if (
    trimmed === "initial" ||
    trimmed === "inherit" ||
    trimmed === "unset" ||
    trimmed === "revert"
  ) {
    return {
      "inset-block-start": trimmed,
      "inset-block-end": trimmed,
    };
  }

  const parts = trimmed.split(/\s+/).filter((p) => p);

  if (parts.length === 1) {
    return {
      "inset-block-start": parts[0],
      "inset-block-end": parts[0],
    };
  }

  // 2 values: start end
  return {
    "inset-block-start": parts[0],
    "inset-block-end": parts[1],
  };
}
