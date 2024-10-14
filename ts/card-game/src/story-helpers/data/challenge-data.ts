import {
  ChallengeState,
  ChallengeStatus as ChallengeStatusObject,
} from '@noice-com/schemas/game-logic/game_logic.pb';

import { ChallengeStatus as ChallengeStatusField } from '@game-logic/challenges';

interface MockedChallenge {
  id: string;
  name: string;
  description: string;
  targetValues: { label: string; value: number }[];
  status: ChallengeStatusField;
}

export const mockedChallenge1: MockedChallenge = {
  id: '1',
  name: 'Challenge 1',
  description: 'Gets Eliminated/Knocked before the first Ring',
  targetValues: [],
  status: 'unresolved',
};

export const mockedChallenge2: MockedChallenge = {
  id: '2',
  name: 'Challenge 2',
  description: 'Deals more than {{amount}} damage',
  targetValues: [{ label: 'amount', value: 2000 }],
  status: 'unresolved',
};

export const mockedChallenge3: MockedChallenge = {
  id: '3',
  name: 'Challenge 3',
  description: 'Eliminates an enemy with a Finisher',
  targetValues: [],
  status: 'unresolved',
};

export const mockChallengesToChallengeStatuses = (
  challenges: MockedChallenge[],
): ChallengeStatusObject[] =>
  challenges.map((challenge) => ({
    challengeId: challenge.id,
    challengeState:
      challenge.status === 'success'
        ? ChallengeState.CHALLENGE_STATE_SUCCESS
        : challenge.status === 'failure'
        ? ChallengeState.CHALLENGE_STATE_FAILURE
        : ChallengeState.CHALLENGE_STATE_UNRESOLVED,
    targetValues: challenge.targetValues,
    pickRate: 0,
  }));

export const mockedChallenges = [mockedChallenge1, mockedChallenge2, mockedChallenge3];

export const mockedChallengesIds = mockedChallenges.map((challenge) => challenge.id);
