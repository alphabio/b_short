// b_path:: src/internal/is-time.ts
// Utility to detect CSS time values for transition-duration and transition-delay parsing
const TIME = /^[+-]?(\d*\.)?\d+(m?s)$/i;

export default function isTime(value: string): boolean {
  return TIME.test(value);
}
