import { StoryHelpers } from '@noice-com/common-ui';

import { PickRateRewardsDocument, ChallengesContentChallengesDocument } from '@game-gen';
import { mockedChallenges } from '@game-story-helpers';

export const mockPickRateRewards = (gameId: string) =>
  StoryHelpers.Apollo.createMock(
    PickRateRewardsDocument,
    { gameId },
    {
      challengeRewards: {
        __typename: 'ChallengeGetChallengeRewardsResponse',
        rewards: [
          {
            __typename: 'ChallengeChallengeReward',
            gameId,
            minPickRate: 0,
            maxPickRate: 20,
            reward: {
              __typename: 'RewardRewardType',
              reward: {
                __typename: 'RewardRewardTypeCurrency',
                currencyId: 'soft-currency',
                currencyAmount: 5000,
              },
            },
          },
          {
            __typename: 'ChallengeChallengeReward',
            gameId,
            minPickRate: 21,
            maxPickRate: 40,
            reward: {
              __typename: 'RewardRewardType',
              reward: {
                __typename: 'RewardRewardTypeCurrency',
                currencyId: 'soft-currency',
                currencyAmount: 4000,
              },
            },
          },
          {
            __typename: 'ChallengeChallengeReward',
            gameId,
            minPickRate: 41,
            maxPickRate: 60,
            reward: {
              __typename: 'RewardRewardType',
              reward: {
                __typename: 'RewardRewardTypeCurrency',
                currencyId: 'soft-currency',
                currencyAmount: 3000,
              },
            },
          },
          {
            __typename: 'ChallengeChallengeReward',
            gameId,
            minPickRate: 61,
            maxPickRate: 80,
            reward: {
              __typename: 'RewardRewardType',
              reward: {
                __typename: 'RewardRewardTypeCurrency',
                currencyId: 'soft-currency',
                currencyAmount: 2000,
              },
            },
          },
          {
            __typename: 'ChallengeChallengeReward',
            gameId,
            minPickRate: 81,
            maxPickRate: 100,
            reward: {
              __typename: 'RewardRewardType',
              reward: {
                __typename: 'RewardRewardTypeCurrency',
                currencyId: 'soft-currency',
                currencyAmount: 1000,
              },
            },
          },
        ],
      },
    },
    true,
  );

export const mockChallenges = (challengeIds: string[]) =>
  StoryHelpers.Apollo.createMock(
    ChallengesContentChallengesDocument,
    { challengeIds },
    {
      challengesBatch: {
        challenges: challengeIds.map((id, index) => ({
          __typename: 'GameLogicChallenge',
          ...mockedChallenges[index % mockedChallenges.length],
          id,
        })),
      },
    },
    true,
  );

interface MockChallengesContentProps {
  gameId: string;
  challengeIds: string[];
}

export const mockChallengesContent = ({
  gameId,
  challengeIds,
}: MockChallengesContentProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockPickRateRewards(gameId),
  mockChallenges(challengeIds),
];
