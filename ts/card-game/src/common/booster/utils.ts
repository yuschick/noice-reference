import { CoreAssets } from '@noice-com/assets-core';
import { NoiceLogoMarkLight } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { GameLogicBooster } from '@game-gen';
import { BoosterType } from '@game-types';

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

export const getBoosterIconComponent = (type: number) => {
  switch (type) {
    case BoosterType.SpeedUp:
      return CoreAssets.Icons.SpeedUp;
    case BoosterType.Scavenge:
      return CoreAssets.Icons.Scavenge;
    case BoosterType.GoodCall:
      return CoreAssets.Icons.GoodCall;
    case BoosterType.LetsGo:
      return CoreAssets.Icons.LetsGooo;
    case BoosterType.NextUp:
      return CoreAssets.Icons.NextUp;
    case BoosterType.Doubt:
      return CoreAssets.Icons.Doubt;
    case BoosterType.Unspecified:
    default:
      return NoiceLogoMarkLight;
  }
};
