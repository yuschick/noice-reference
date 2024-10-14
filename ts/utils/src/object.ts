import merge from 'lodash.merge';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const invertObject = (obj: Record<string, any>): Record<string, any> => {
  const currKeys = Object.keys(obj);
  const result: Record<string, any> = {};
  currKeys.forEach((key) => {
    if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
      result[obj[key]] = key;
    }
  });
  return result;
};

export function deepMerge<T = unknown>(obj1: T, obj2: unknown): T {
  return merge({}, obj1, obj2);
}
