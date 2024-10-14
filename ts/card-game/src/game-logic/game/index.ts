import { StoryHelpers } from '@noice-com/common-ui';

import { mockGameStateBoosters, mockGameStateGameCard } from './mocks';

export * from './CardGame';
export * from './GameConfig';
export * from './types';

export interface GameMockProps {
  cardId?: string;
  boosterId?: number;
  repeatMockResponse?: boolean;
}

export const mockGameState = ({
  cardId,
  boosterId,
  repeatMockResponse,
}: GameMockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(cardId ? [mockGameStateGameCard(cardId, repeatMockResponse)] : []),
  ...(boosterId ? [mockGameStateBoosters(boosterId, repeatMockResponse)] : []),
];
