import { StoryHelpers } from '@noice-com/common-ui';

import { mockCardRowAvatar } from '@game-components/CardRowAvatar';

interface MockProps {
  playerId: string;
}

export const mockSpectatorPlayerInfo = ({
  playerId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => mockCardRowAvatar({ playerId });
