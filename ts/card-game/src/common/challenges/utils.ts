import {
  findCustomKeys,
  isCustomKey,
  splitAndKeepSeparator,
} from '@game-common/game/utils';

export const splitDescription = (description: string): string[] => {
  const separators = findCustomKeys(description);

  return separators.reduce(
    (acc, separator) => acc.flatMap((part) => splitAndKeepSeparator(part, separator)),
    [description],
  );
};

export const getPlaceholderValue = (
  text: string,
  targetValues: { label: string; value: number }[],
): number | null => {
  const key = isCustomKey(text);

  if (key) {
    const targetValue = targetValues.find((v) => v.label === key);

    if (targetValue) {
      return targetValue.value;
    }
  }

  return null;
};

export const parseChallengeDescription = (
  description: string,
  targetValues: { label: string; value: number }[],
): string =>
  splitDescription(description)
    .map((part) => getPlaceholderValue(part, targetValues) ?? part)
    .join('');
