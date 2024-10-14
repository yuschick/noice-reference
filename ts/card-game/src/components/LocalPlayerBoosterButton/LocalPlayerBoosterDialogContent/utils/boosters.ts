import { Nullable } from '@noice-com/utils';

import { GameLogicBooster } from '@game-gen';

const nameReplacer = (str: Nullable<string>, playerName: string, targetName: string) =>
  str
    ? str.replace('{playerName}', playerName).replace('{targetName}', targetName)
    : null;

export function replaceDynamicBoosterNames<
  D extends Pick<
    GameLogicBooster,
    'descriptionDefaultBenefit' | 'descriptionTargetNoneBenefit'
  >,
>(boosterOwner: string, boosterTarget: string, boosterDescriptions: D): D {
  return {
    ...boosterDescriptions,
    descriptionDefaultBenefit: nameReplacer(
      boosterDescriptions.descriptionDefaultBenefit,
      boosterOwner,
      boosterTarget,
    ),
    descriptionTargetNoneBenefit: nameReplacer(
      boosterDescriptions.descriptionTargetNoneBenefit,
      boosterOwner,
      boosterTarget,
    ),
  };
}
