// b_path:: src/is-length.ts
const LENGTH = /^(\+|-)?([0-9]*\.)?[0-9]+(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)$/i;
const ZERO = /^(\+|-)?(0*\.)?0+$/;

export default function isLength(value: string): boolean {
  return LENGTH.test(value) || ZERO.test(value);
}
