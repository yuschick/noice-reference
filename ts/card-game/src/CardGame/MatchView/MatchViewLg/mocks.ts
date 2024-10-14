import { StoryHelpers } from '@noice-com/common-ui';

import { mockProgressionIsPaused } from '../mocks/story-mocks';

import { MockCardRowProps, mockCardRow } from './CardRow';
import { mockCardSelect } from './CardSelect';

export interface MockMatchViewLgProps {
  players: MockCardRowProps[];
  cardSelectActiveCardId: string;
  handCardIds: string[];
  matchCardIds: string[];
  channelId: string;
  isProgressionPaused?: boolean;
}

export const mockMatchViewLg = ({
  channelId,
  isProgressionPaused,
  players,
  cardSelectActiveCardId,
  handCardIds,
  matchCardIds,
}: MockMatchViewLgProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(isProgressionPaused ? [mockProgressionIsPaused(channelId)] : []),
  ...mockCardSelect({
    activeCardId: cardSelectActiveCardId,
    handCardIds,
    matchCardIds,
  }),
  ...players.map((player) => mockCardRow(player)).flat(),
];
