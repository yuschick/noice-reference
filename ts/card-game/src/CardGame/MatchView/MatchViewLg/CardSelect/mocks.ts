import { StoryHelpers } from '@noice-com/common-ui';

import { mockCardSelectHand } from './CardSelectHand';
import { mockMatchCards } from './MatchCards';

import { mockPlayerActiveCard } from '@game-components/PlayerActiveCard';

interface Props {
  activeCardId?: string;
  handCardIds: string[];
  matchCardIds: string[];
}

export const mockCardSelect = ({
  activeCardId,
  handCardIds,
  matchCardIds,
}: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  mockCardSelectHand(handCardIds),
  mockMatchCards(matchCardIds),
  ...(activeCardId ? mockPlayerActiveCard({ cardId: activeCardId }) : []),
];
