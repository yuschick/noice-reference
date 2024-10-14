import { StoryHelpers } from '@noice-com/common-ui';

import {
  mockDisplayBottomProfile as mockDisplayBottomProfileFunc,
  mockDisplayBottomProfileLoading,
} from './mocks/story-mocks';

import { mockCardRowAvatar } from '@game-components/CardRowAvatar';

interface MockProps {
  playerId: string;
  loading?: boolean;
}

export const mockDisplayBottom = ({
  playerId,
  loading,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  loading
    ? mockDisplayBottomProfileLoading(playerId)
    : mockDisplayBottomProfileFunc(playerId),
  ...mockCardRowAvatar({ playerId }),
];
