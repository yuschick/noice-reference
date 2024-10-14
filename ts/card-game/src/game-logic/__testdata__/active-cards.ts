/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActiveCard } from '@noice-com/schemas/game-logic/game_logic.pb';

import { GameStateCardFragment } from '@game-gen';

const NOW = Date.now();
const START_TIME = new Date(NOW).toISOString();
const END_TIME = new Date(NOW + 5000).toISOString();

export const BasicCard: ActiveCard = {
  cardId: 'basic-active-card',
  setTime: '',
  pointsUpdateTime: '',
  points: 50,
  pointsMin: 50,
  pointsMax: 100,
  pointsTimeTarget: 0,
  pointsUpdateTimer: {
    startTime: START_TIME,
    endTime: END_TIME,
  },
  targetValue: 0,
  activeBoosters: {},
  timerDuration: 0,
  targetValues: {
    targetValue: 0,
    timerDuration: 0,
  },
};

export const TimedCard: ActiveCard = {
  cardId: 'timed-active-card',
  setTime: '',
  pointsUpdateTime: '',
  points: 75,
  pointsMin: 50,
  pointsMax: 125,
  pointsTimeTarget: 0,
  pointsUpdateTimer: {
    startTime: START_TIME,
    endTime: END_TIME,
  },
  targetValue: 60,
  activeBoosters: {},
  timerDuration: 60,
  targetValues: {
    targetValue: 60,
    timerDuration: 60,
  },
};

export const DynamicValueCard: ActiveCard = {
  cardId: 'timed-active-card',
  setTime: '',
  pointsUpdateTime: '',
  points: 55,
  pointsMin: 55,
  pointsMax: 95,
  pointsTimeTarget: 0,
  pointsUpdateTimer: {
    startTime: START_TIME,
    endTime: END_TIME,
  },
  targetValue: 120,
  activeBoosters: {},
  targetValues: {
    targetValue: 120,
  },
};

export const activeCardAsFragment = (mockCard: ActiveCard): GameStateCardFragment => {
  const targetValues = Object.entries(mockCard.targetValues ?? {}).map(([key, val]) => {
    return {
      label: key,
      value: val,
    };
  });

  return {
    __typename: 'GameLogicCard',
    id: mockCard.cardId!,
    pointsMin: mockCard.pointsMin!,
    pointsMax: mockCard.pointsMax!,
    pointsTimeTarget: mockCard.pointsTimeTarget!,
    timerDuration: mockCard.timerDuration!,
    targetValue: mockCard.targetValue!,
    isMatchCard: false,
    isAllOrNothing: false,
    targetValues: targetValues,
  };
};
