import { StoryHelpers } from '@noice-com/common-ui';

import { mockActiveBoosters } from './ActiveBoosters';

import { mockPlayerActiveCard } from '@game-components/PlayerActiveCard';
import { GameCard } from '@game-story-helpers';

interface MockProps {
  appliedBoosterIds?: number[];
  boosterId?: number;
  cardId?: string;
  cardData?: Partial<GameCard>;
  playerId: string;
}

export const mockCardRowActiveCard = ({
  cardId,
  appliedBoosterIds,
  playerId,
  boosterId,
  cardData,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockActiveBoosters({ appliedBoosterIds, boosterId, playerId }),
  ...(cardId ? mockPlayerActiveCard({ cardId, cardData }) : []),
];
