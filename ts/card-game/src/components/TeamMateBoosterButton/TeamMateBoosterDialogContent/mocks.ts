import { StoryHelpers } from '@noice-com/common-ui';

import { mockTeamMateBoosterDialogContent as mockTeamMateBoosterDialogContentFunc } from './mocks/story-mocks';

interface MockProps {
  playerId: string;
  boosterId: number;
  repeatMockResponse?: boolean;
}

export const mockTeamMateBoosterDialogContent = ({
  playerId,
  boosterId,
  repeatMockResponse,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockTeamMateBoosterDialogContentFunc(playerId, boosterId, repeatMockResponse),
];
