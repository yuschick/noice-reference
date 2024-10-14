/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';

import * as MockCards from '../__testdata__/active-cards';

// @todo: This was made for one of my many attempts to make mocking easier.
// It hasn't been deleted in case we want to do something with it.

const DEFAULT_STARTING_TIME = 1;

// #region Templates

export const newPlayerTemplate: GameLogic.Player = {
  name: '1a2b3c4d-e5f6-g7h8-i910-j11k12l13',
  userName: 'NewPlayer#1337',
  isOnline: true,
  points: 0,
  hand: undefined,
  activeCard: undefined,
  boosterCooldownTimer: {
    startTime: `${DEFAULT_STARTING_TIME}`,
    endTime: `${DEFAULT_STARTING_TIME + 60000}`,
  },
  cardSwitchOutTimer: undefined,
  heldBoosterId: 0,
  usedBoosterCount: 0,
  selfUsedBoosterCount: 0,
  bestPlay: undefined,
  allOrNothing: undefined,
  reshuffleCount: 0,
  usedMatchCards: {},
};

export const existingPlayerTemplate: GameLogic.Player = {
  name: '1a2b3c4d-e5f6-g7h8-i910-j11k12l13',
  userName: 'ExistingTemplate#1337',
  isOnline: true,
  points: 300,
  hand: {
    matchEndCardIds: [],
    votes: [],
    cardIds: [
      MockCards.BasicCard.cardId!,
      MockCards.DynamicValueCard.cardId!,
      MockCards.TimedCard.cardId!,
    ],
  },
  activeCard: {
    ...MockCards.BasicCard,
  },
  boosterCooldownTimer: undefined,
  cardSwitchOutTimer: {
    startTime: `${DEFAULT_STARTING_TIME}`,
    endTime: `${DEFAULT_STARTING_TIME + 30000}`,
  },
  heldBoosterId: 2,
  usedBoosterCount: 3,
  selfUsedBoosterCount: 0,
  bestPlay: {
    activeBoosters: [],
    cardId: MockCards.BasicCard.cardId!,
    points: 300,
  },
  allOrNothing: undefined,
  reshuffleCount: 20,
  usedMatchCards: {},
};

// #endregion Templates

// #region Players
export const makeNewPlayer = (userId: string, userName: string): GameLogic.Player => {
  return {
    ...newPlayerTemplate,
    userId,
    userName,
  };
};

interface PlayerOpts {
  points: number;
  card?: GameLogic.ActiveCard;
  bestPlay?: GameLogic.BestPlay;
}

export const makeExistingPlayer = (
  userId: string,
  userName: string,
  opts?: PlayerOpts,
): GameLogic.Player => {
  const activeCard = { ...(opts?.card ?? existingPlayerTemplate.activeCard) };
  const bestPlay = { ...(opts?.bestPlay ?? existingPlayerTemplate.bestPlay) };

  return {
    ...existingPlayerTemplate,
    userId,
    userName,
    activeCard,
    bestPlay,
    points: opts?.points ?? existingPlayerTemplate.points,
  };
};

// #endregion Players
// #region Groups

export const defaultLocalGroup: GameLogic.Group = {
  name: 'TestGroup',
  points: 0,
  id: 'test-group',
};

// #endregion Groups
// #region Messages

// #endregion Messages
