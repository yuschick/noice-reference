// Typescript 5.5+ knows how to infer the predicate type, but until then, this can be used
// See https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/#inferred-type-predicates
export function isDefined<T>(value: T | undefined | null | false): value is T {
  return value !== undefined && value !== null && value !== false;
}
