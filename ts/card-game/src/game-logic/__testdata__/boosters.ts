/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import * as GameSchemas from '@noice-com/schemas/game-logic/game_logic.pb';

import { CgActiveBoosterFragment, CgAvailableBoosterFragment } from '@game-gen';

export const StandardBooster: GameSchemas.Booster = {
  id: 1,
  timeActive: 0,
  canTargetSelf: true,
  valueOther: 300,
  valueSelf: 200,
  image: 'Standard.svg',
  name: 'Standard Booster',
};

export const TeammateOnlyBooster: GameSchemas.Booster = {
  id: 2,
  timeActive: 0,
  canTargetSelf: false,
  valueOther: 300,
  valueSelf: 0,
  image: 'Teammate.svg',
  name: 'Teammate Only Booster',
};

export const TimedBooster: GameSchemas.Booster = {
  id: 3,
  timeActive: 6000,
  canTargetSelf: true,
  valueOther: 300,
  valueSelf: 300,
  image: 'Timed.svg',
  name: 'Timed booster',
};

export const boosterAsFragment = (
  booster: GameSchemas.Booster,
): CgAvailableBoosterFragment & CgActiveBoosterFragment => ({
  __typename: 'GameLogicBooster',
  id: booster.id!,
  timeActive: booster.timeActive ?? 0,
  valueSelf: booster.valueSelf ?? 0,
  valueOther: booster.valueOther ?? 0,
  image: booster.image ?? 'unknown.svg',
  name: booster.name ?? 'Unknown',
  canTargetSelf: booster.canTargetSelf ?? false,
});

export const boosterAsActiveFragment = (
  booster: GameSchemas.Booster,
): CgActiveBoosterFragment => ({
  __typename: 'GameLogicBooster',
  id: booster.id!,
  timeActive: booster.timeActive ?? 0,
  valueSelf: booster.valueSelf ?? 0,
  valueOther: booster.valueOther ?? 0,
  image: booster.image ?? 'unknown.svg',
  name: booster.name ?? 'Unknown',
});
