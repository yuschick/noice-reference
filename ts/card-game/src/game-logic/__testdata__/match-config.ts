import { MatchConfiguration } from '@noice-com/schemas/game-logic/game_logic.pb';

export const FullMatchConfig: MatchConfiguration = {
  aonPointMultipliers: [1, 1.5, 2],
  gameId: 'fortnite',
  handSize: 5,
  pointsGainTime: 5000,
  reshuffleBaseCost: 0,
  reshuffleCostMultiplier: 1.5,
  boosterCooldowns: ['30000', '60000', '90000'],
  cardSwitchOutTimerDuration: '90000',
  seasonId: 'testSeasonId',
};

export function getPartialConfig(...omit: (keyof MatchConfiguration)[]) {
  const result: MatchConfiguration = {
    ...FullMatchConfig,
  };

  omit.forEach((objKey) => {
    result[objKey] = undefined;
  });

  return result;
}
