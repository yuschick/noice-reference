import { StoryHelpers } from '@noice-com/common-ui';

import { mockChallenges, mockPickRateRewards } from '@game-common/challenges';
import { PickRateRewardsDocument, ChallengesContentChallengesDocument } from '@game-gen';

export interface MockChallengesDialogProps {
  gameId: string;
  challengeIds: string[];
  isLoading?: boolean;
}

const mockPickRateRewardsLoading = (gameId: string) =>
  StoryHelpers.Apollo.createDelayedMock(
    PickRateRewardsDocument,
    { gameId },
    null,
    1000000,
  );

const mockChallengesLoading = (challengeIds: string[]) =>
  StoryHelpers.Apollo.createDelayedMock(
    ChallengesContentChallengesDocument,
    { challengeIds },
    null,
    1000000,
  );

export const mockChallengesDialog = ({
  gameId,
  challengeIds,
  isLoading,
}: MockChallengesDialogProps): StoryHelpers.Apollo.GraphqlMock[] =>
  isLoading
    ? [mockPickRateRewardsLoading(gameId), mockChallengesLoading(challengeIds)]
    : [mockPickRateRewards(gameId), mockChallenges(challengeIds)];
