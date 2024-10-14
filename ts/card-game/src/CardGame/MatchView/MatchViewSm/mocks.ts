import { StoryHelpers } from '@noice-com/common-ui';

import { mockProgressionIsPaused } from '../mocks/story-mocks';

import { MockCardRowProps, mockCardRow } from './CardRow';
import { mockCardSelect } from './CardSelect';

export interface MockMatchViewSmProps {
  players: MockCardRowProps[];
  handCardIds: string[];
  matchCardIds: string[];
  channelId: string;
  isProgressionPaused?: boolean;
}

export const mockMatchViewSm = ({
  channelId,
  isProgressionPaused,
  players,
  handCardIds,
  matchCardIds,
}: MockMatchViewSmProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(isProgressionPaused ? [mockProgressionIsPaused(channelId)] : []),
  ...mockCardSelect({
    cardIds: [...matchCardIds, ...handCardIds],
  }),
  ...players.map((player) => mockCardRow(player)).flat(),
];
