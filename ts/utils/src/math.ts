/**
 * Clamps a value within a provided min/max.
 * @param {number} val The value to clamp.
 * @param {number} min The minimum value (inclusive).
 * @param {number} max The maximum value (inclusive).
 * @returns {number} The clamped value.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export const stringMath = (
  operator: 'add' | 'substract',
  a?: string,
  b?: string,
): string => {
  const numA = parseInt(a ?? '', 10);
  const numB = parseInt(b ?? '', 10);

  switch (operator) {
    case 'add':
      return `${numA + numB}`;
    case 'substract':
      return `${numA - numB}`;
  }
};

/**
 * Transforms a value from one range to another.
 * @param {number} value The value to interpolate.
 * @param {number} min1 The minimum value for the first range.
 * @param {number} max1 The maximum value for the first range.
 * @param {number} min2 The minimum value for the second range.
 * @param {number} max2 The maximum value for the second range.
 * @returns {number} The interpolated value.
 */
export function transformRange(
  value: number,
  min1: number,
  max1: number,
  min2 = 0,
  max2 = 1,
): number {
  return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
}

/**
 * Transforms a value to shorter format, like
 * 28467 => 28K
 * @param {number} number The value to transform
 */
export function transformNumberToShortString(number: number) {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return formatter.format(number);
}
