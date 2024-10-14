export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
  myEnum: T,
  enumValue: string,
): keyof T | null {
  const key = Object.keys(myEnum).find((x) => myEnum[x] === enumValue);

  return key ?? null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Makes mapping of state enum where key is one step
 * and value is valid next step
 *
 * @param defaultNextStepMapping - Mapping when everything is perfect in world:
 * {
 *   [AnimationState.None]: AnimationState.Animate,
 *   [AnimationState.Animate]: AnimationState.Finished,
 *   [AnimationState.Finished]: AnimationState.Finished,
 * }
 *
 * @param stateEnum - Enum that is used: AnimationState
 *
 * @param currentStepIsValid - Function that check if each state is valid
 */
export const getNextStateMapping = <T extends keyof any>(
  defaultNextStepMapping: Record<T, T>,
  stateEnum: any,
  currentStepIsValid: (currentStep: T, latestValidNextStep: T) => boolean = () => true,
  skipStates: T[] = [],
): Record<T, T> => {
  const reversedKeys = Object.keys(defaultNextStepMapping)
    .map((value) => stateEnum[stateEnum[value as string]])
    .reverse();

  let latestValidNextStep: T = reversedKeys[0];
  return reversedKeys.reduce<Record<T, T>>((nextStateMap, currentStep) => {
    // Update current states next step to be latest valid step
    const states = {
      ...nextStateMap,
      [currentStep]: latestValidNextStep,
    };

    if (
      currentStepIsValid(currentStep as T, latestValidNextStep) &&
      !skipStates.includes(currentStep as T)
    ) {
      latestValidNextStep = currentStep as T;
    }

    return states;
  }, defaultNextStepMapping);
};
