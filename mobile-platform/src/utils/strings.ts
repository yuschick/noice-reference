export function pluralize(count: number, singularOption: string, pluralOption: string) {
  return count === 1 ? singularOption : pluralOption;
}
