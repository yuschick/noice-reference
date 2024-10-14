import { StoryHelpers } from '@noice-com/common-ui';

import { mockLocalPlayerBoosterDialogContent as mockLocalPlayerBoosterDialogContentFunc } from './mocks/story-mocks';

interface MockProps {
  boosterId: number;
  repeatMockResponse?: boolean;
}

export const mockLocalPlayerBoosterDialogContent = ({
  boosterId,
  repeatMockResponse,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockLocalPlayerBoosterDialogContentFunc(boosterId, repeatMockResponse),
];
