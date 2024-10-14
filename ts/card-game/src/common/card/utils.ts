import { Attribute } from '@noice-com/schemas/game-logic/game_logic.pb';

import {
  findCustomKeys,
  findGlobals,
  isCustomKey,
  splitAndKeepSeparator,
} from '@game-common/game/utils';
import {
  GameLogicCard,
  GameLogicTargetValue,
  GameStateCardTargetValuesFragment,
} from '@game-gen';

const TARGET_KEY = '{targetValue}';
const TIMER_KEY = '{timerDuration}';

export const isTargetValue = (text: string): boolean => text === TARGET_KEY;

export const isTimerDuration = (text: string): boolean => text === TIMER_KEY;

export const splitDescription = (description: string): string[] => {
  const customKeys = findCustomKeys(description);

  if (
    !description.includes(TARGET_KEY) &&
    !description.includes(TIMER_KEY) &&
    customKeys.length === 0
  ) {
    return [description];
  }

  const separators = [...customKeys, TARGET_KEY, TIMER_KEY];

  return separators.reduce(
    (acc, separator) => acc.flatMap((part) => splitAndKeepSeparator(part, separator)),
    [description],
  );
};

export const getPlaceholderValue = (
  text: string,
  {
    targetValue,
    timerDuration,
    targetValues,
  }: {
    targetValue: number;
    timerDuration: number;
    targetValues: GameLogicTargetValue[];
  },
): number | null => {
  if (isTargetValue(text)) {
    return targetValue;
  }

  if (isTimerDuration(text)) {
    return timerDuration;
  }

  const key = isCustomKey(text);
  if (key) {
    const targetValue = targetValues.find((v) => v.label === key);

    if (targetValue) {
      return targetValue.value;
    }
  }

  return null;
};

export const parseGlobals = (description: string, globals: Attribute[]): string => {
  const globalMatches = findGlobals(description);
  let out = description;
  globalMatches.forEach((match) => {
    const [descriptionStrToReplace, globalKey, defaultValue] = match;
    const global = globals.find((g) => g.name === globalKey);
    if (!global) {
      out = out.replace(descriptionStrToReplace, defaultValue ?? '');
      return;
    }
    out = out.replace(
      descriptionStrToReplace,
      global.stringValue ||
        global.intValue?.toString() ||
        global.boolValue?.toString() ||
        defaultValue ||
        '',
    );
  });
  return out;
};

// Takes in the union typed Fragment and returns the normalized targetValues
// where all selector values are parsed to "value" fields instead of "stringValue" | "intValue" | "booleanValue"
export const normalizeTargetValues = (
  targetValues: GameStateCardTargetValuesFragment['targetValues'],
): GameLogicTargetValue[] =>
  targetValues.map(
    (tv) =>
      ({
        ...tv,
        ...(tv.selector
          ? {
              selector: {
                ...tv.selector,
                value: {
                  ...tv.selector.value,
                  ...(tv.selector.value?.__typename === 'StringType'
                    ? { value: tv.selector.value.stringValue }
                    : {}),
                  ...(tv.selector.value?.__typename === 'IntType'
                    ? { value: tv.selector.value.intValue }
                    : {}),
                  ...(tv.selector.value?.__typename === 'BooleanType'
                    ? { value: tv.selector.value.booleanValue }
                    : {}),
                },
              },
            }
          : {}),
      } as GameLogicTargetValue),
  );

const groupTargetValuesByLabel = (
  targetValues: GameLogicTargetValue[],
): Record<string, GameLogicTargetValue[]> =>
  targetValues.reduce<Record<string, GameLogicTargetValue[]>>((map, targetValue) => {
    if (!map[targetValue.label]) {
      return {
        ...map,
        [targetValue.label]: [targetValue],
      };
    }
    return {
      ...map,
      [targetValue.label]: [...map[targetValue.label], targetValue],
    };
  }, {});

// Find the correct targetValue by the global value in following priority:
// 1. If we have a selector, we compare the global value with the selector value
// 2. If we have a default value, we return that
// 3. If we have no matching selector or default value, we return the first targetValue
const getCorrectTargetValueByGlobal = (
  targetValues: GameLogicTargetValue[],
  globals: Attribute[],
): GameLogicTargetValue | null => {
  // 1. Find the matching global
  const foundMatchingGlobal = targetValues.find((targetValue) => {
    const global = globals.find((g) => g.name === targetValue.selector?.attribute);
    const globalValue =
      global?.stringValue ?? global?.intValue ?? global?.boolValue ?? null;
    // Typescript does not like graphql unions
    const selectorValue =
      targetValue.selector?.value?.__typename === 'StringType' ||
      targetValue.selector?.value?.__typename === 'IntType' ||
      targetValue.selector?.value?.__typename === 'BooleanType'
        ? targetValue.selector.value.value
        : null;
    const selectorMatchesGlobal =
      globalValue && selectorValue && globalValue === selectorValue;

    return selectorMatchesGlobal;
  });
  if (foundMatchingGlobal) {
    return foundMatchingGlobal;
  }

  // 2. Use the default value if we have one
  const defaultValue = targetValues.find(
    (targetValue) =>
      targetValue.selector?.value?.__typename ===
      'GameLogicTargetValueSelectorDefaultValue',
  );
  if (defaultValue) {
    return defaultValue;
  }

  // 3. If we have no matching selector or default value, we return the first targetValue
  return targetValues.length > 0 ? targetValues[0] : null;
};

export const getCorrectTargetValuesByGlobals = (
  targetValues: GameLogicTargetValue[],
  globals: Attribute[],
): GameLogicTargetValue[] => {
  const groupedTargetValues = groupTargetValuesByLabel(targetValues);

  return Object.values(groupedTargetValues).flatMap((group) => {
    const groupTargetValue = getCorrectTargetValueByGlobal(group, globals);

    return groupTargetValue ? [groupTargetValue] : [];
  });
};

export const parseDescription = (
  cardData: Pick<GameLogicCard, 'targetValue' | 'timerDuration' | 'description'> &
    GameStateCardTargetValuesFragment,
  globals?: Attribute[],
): string => {
  const targetValue = cardData.targetValue ?? 0;
  const timerDuration = cardData.timerDuration ?? 0;
  const normalizedTargetValues = normalizeTargetValues(cardData.targetValues);
  const targetValues = getCorrectTargetValuesByGlobals(
    normalizedTargetValues,
    globals ?? [],
  );

  const descriptionWithGlobalsParsed = parseGlobals(cardData.description, globals ?? []);

  return splitDescription(descriptionWithGlobalsParsed)
    .map(
      (part) =>
        getPlaceholderValue(part, {
          targetValue,
          timerDuration,
          targetValues,
        }) ?? part,
    )
    .join('');
};
