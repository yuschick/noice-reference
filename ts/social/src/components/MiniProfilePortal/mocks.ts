import { StoryHelpers } from '@noice-com/common-ui';

import { mockMiniProfile } from './mocks/story-mocks';

interface MockProps {
  userId: string;
}

export const mockMiniProfilePortal = ({
  userId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [mockMiniProfile(userId)];
