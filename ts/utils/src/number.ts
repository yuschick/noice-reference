const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });

const ordinalSuffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);
export const getNumberWithOrdinal = (n: number): string => {
  const rule = ordinalRules.select(n);
  const suffix = ordinalSuffixes.get(rule);

  return `${n}${suffix}`;
};
