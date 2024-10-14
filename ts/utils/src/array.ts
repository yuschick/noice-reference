export function reduce<TOriginal, TResult>(
  array: TOriginal[],
  reducer: (result: TResult, el: TOriginal, index: number) => TResult,
  initialResult: TResult,
): TResult {
  let result = initialResult;

  for (let i = 0; i < array.length; i++) {
    result = reducer(result, array[i], i);
  }

  return result;
}

export function cleanArray<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item) => !!item) as T[];
}

export function mapExisting<TOriginal, TResult = TOriginal>(
  arr: TOriginal[],
  cb: (current: TOriginal, index: number, arr: TOriginal[]) => TResult,
): NonNullable<TResult>[] {
  const result: TResult[] = [];

  arr.forEach((value, index) => {
    const iteration = cb(value, index, arr);

    if (iteration === null || typeof iteration === 'undefined') {
      return;
    }

    result.push(iteration);
  });

  return result;
}

export const randomFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const randomShuffleArray = <T>(arr: T[]): T[] =>
  arr.sort(() => 0.5 - Math.random());

export const randomUniqueFromArray = <T>(
  arr: T[],
  reference: T,
  callback: (a: T, b: T) => boolean = (a, b) => a === b,
): T => {
  const next = randomFromArray(arr);

  if (!callback(next, reference) || arr.length === 1) {
    return next;
  }

  // Get the next on either side.
  const refIndex = arr.indexOf(reference);
  let left = refIndex - 1;
  let right = refIndex + 1;

  if (left < 0) {
    left = arr.length - 1;
  }

  if (right >= arr.length) {
    right = 0;
  }

  // Get a random number between 0 - 1.
  // If it's greater than 0.5 use the item to the right.
  // If not, use the left.
  return Math.random() > 0.5 ? arr[right] : arr[left];
};
