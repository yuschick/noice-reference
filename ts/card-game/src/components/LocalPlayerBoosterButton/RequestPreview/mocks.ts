import { StoryHelpers } from '@noice-com/common-ui';

import { mockBoosterRequestProfile } from './mocks/story-mocks';

interface MockProps {
  userId: string;
  repeatMockResponse?: boolean;
}

export const mockRequestPreview = ({
  userId,
  repeatMockResponse,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockBoosterRequestProfile(userId, repeatMockResponse),
];
