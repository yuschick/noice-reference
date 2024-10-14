import { BoosterType } from '@game-types';

export const cardSize = {
  name: 'Card Size',
  defaultValue: 'large',
  options: ['xsmall', 'small', 'medium', 'large'],
  control: { type: 'select' },
};

export const boosterType = {
  name: 'Booster type',
  options: Object.values(BoosterType),
  control: {
    type: 'select',
    labels: {
      [BoosterType.Doubt]: 'Doubt',
      [BoosterType.GoodCall]: 'GoodCall',
      [BoosterType.LetsGo]: 'LetsGo',
      [BoosterType.NextUp]: 'NextUp',
      [BoosterType.Scavenge]: 'Scavenge',
      [BoosterType.SpeedUp]: 'SpeedUp',
      [BoosterType.Unspecified]: 'Unspecified',
    },
  },
};
