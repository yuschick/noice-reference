import { StoryHelpers } from '@noice-com/common-ui';
import { mockMiniProfilePortal } from '@noice-com/social';

interface MockProps {
  playerId: string;
}

export const mockCardRowAvatar = ({
  playerId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockMiniProfilePortal({ userId: playerId }),
];
