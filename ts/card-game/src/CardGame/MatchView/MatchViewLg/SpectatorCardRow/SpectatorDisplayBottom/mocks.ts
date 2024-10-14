import { StoryHelpers } from '@noice-com/common-ui';

import { mockSpectatorPlayerInfo } from './SpectatorPlayerInfo';

interface MockProps {
  playerId: string;
}

export const mockSpectatorDisplayBottom = ({
  playerId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockSpectatorPlayerInfo({ playerId }),
];
