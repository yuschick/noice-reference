import { StoryHelpers } from '@noice-com/common-ui';

import { mockTeamMateBoosterTooltipContent as mockTeamMateBoosterTooltipContentFn } from './mocks/story-mocks';

interface MockProps {
  playerId: string;
  boosterId: number;
  repeatMockResponse?: boolean;
}

export const mockTeamMateBoosterTooltipContent = ({
  playerId,
  boosterId,
  repeatMockResponse,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockTeamMateBoosterTooltipContentFn(playerId, boosterId, repeatMockResponse),
];
