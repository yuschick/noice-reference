/**
 * A sorting function for sorting numerical values in descending order.
 * @example
 * const arr = [10, 5, 20, 15];
 * arr.sort(sortDescending); // [5, 10, 15, 20]
 *
 * @param {number} a The first value.
 * @param {number} b The second value.
 * @returns {number} The delta. Positive means 'higher', negative 'lower'.
 */
export function sortAscending(a: number, b: number): number {
  return a - b;
}

/**
 * A sorting function for sorting numerical values in descending order.
 * @example
 * const arr = [10, 5, 20, 15];
 * arr.sort(sortDescending); // [20, 15, 10, 5]
 *
 * @param {number} a The first value.
 * @param {number} b The second value.
 * @returns {number} The delta. Positive means 'higher', negative 'lower'.
 */
export function sortDescending(a: number, b: number): number {
  return -1 * (a - b);
}
