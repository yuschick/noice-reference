import { StoryHelpers } from '@noice-com/common-ui';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockGameStateChallenges as mockGameStateChallengesFn } from './mocks/story-mocks';

export { CGChallengesSystem } from './CGChallengesSystem';

export type { ChallengeStatus } from './hooks/useChallengeStatuses.hook';

export interface ChallengesStateMockProps {
  challenges?: GameLogic.ChallengeStatesData;
}

export const mockGameStateChallenges = ({
  challenges,
}: ChallengesStateMockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(challenges ? [mockGameStateChallengesFn(challenges)] : []),
];
