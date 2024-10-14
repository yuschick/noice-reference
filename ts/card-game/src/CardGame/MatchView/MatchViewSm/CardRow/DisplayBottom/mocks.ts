import { StoryHelpers } from '@noice-com/common-ui';

import { mockPlayerScore } from './PlayerScore';

import { mockCardRowAvatar } from '@game-components/CardRowAvatar';

interface MockProps {
  playerId: string;
  loading?: boolean;
}

export const mockDisplayBottom = ({
  playerId,
  loading,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockPlayerScore({ playerId, loading }),
  ...mockCardRowAvatar({ playerId }),
];
