import { StoryHelpers } from '@noice-com/common-ui';

import { mockPlayerInfoProfile, mockPlayerInfoProfileLoading } from './mocks/story-mocks';

interface MockProps {
  playerId: string;
  loading?: boolean;
}

export const mockPlayerScore = ({
  playerId,
  loading,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  loading ? mockPlayerInfoProfileLoading(playerId) : mockPlayerInfoProfile(playerId),
];
