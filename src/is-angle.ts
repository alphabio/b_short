// b_path:: src/is-angle.ts
const ANGLE = /^(\+|-)?([0-9]*\.?[0-9]+)(deg|rad|turn|grad)$/i;
const ZERO = /^(\+|-)?(0*\.)?0+$/;

export default function isAngle(value: string): boolean {
  return ANGLE.test(value) || ZERO.test(value);
}
