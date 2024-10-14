import { StoryHelpers } from '@noice-com/common-ui';

import { mockDisplayBottom } from '../DisplayBottom';

import { mockAllOrNothingPending } from '@game-common/card';
import { mockCardWithHighlightState } from '@game-common/card/CardWithHighlightState';
import { mockCardRowActiveCard } from '@game-components/CardRowActiveCard';
import { mockCardRowAvatar } from '@game-components/CardRowAvatar';
import { mockTeamMateBoosterButton } from '@game-components/TeamMateBoosterButton';
import { GameCard } from '@game-story-helpers';

interface MockProps {
  appliedBoosterIds?: number[];
  boosterId?: number;
  cardId?: string;
  playerId: string;
  loading?: boolean;
  cardData?: Partial<GameCard>;
}

export const mockTeamMateDisplay = ({
  appliedBoosterIds,
  boosterId,
  playerId,
  cardId,
  loading,
  cardData,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(cardId ? mockCardWithHighlightState({ cardId }) : []),
  ...(cardId ? mockAllOrNothingPending({ cardId }) : []),
  ...mockCardRowActiveCard({ cardId, appliedBoosterIds, boosterId, playerId, cardData }),
  ...mockTeamMateBoosterButton({ playerId, boosterId }),
  ...mockCardRowAvatar({ playerId }),
  ...mockDisplayBottom({ playerId, loading }),
];
