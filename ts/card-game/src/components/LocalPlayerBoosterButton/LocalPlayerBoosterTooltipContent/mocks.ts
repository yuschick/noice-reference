import { StoryHelpers } from '@noice-com/common-ui';

import { mockLocalPlayerBoosterTooltipContent as mockLocalPlayerBoosterTooltipContentFunc } from './mocks/story-mocks';

interface MockProps {
  boosterId: number;
  repeatMockResponse?: boolean;
}

export const mockLocalPlayerBoosterTooltipContent = ({
  boosterId,
  repeatMockResponse,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockLocalPlayerBoosterTooltipContentFunc(boosterId, repeatMockResponse),
];
