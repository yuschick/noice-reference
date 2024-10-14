import { StoryHelpers } from '@noice-com/common-ui';

import { mockDisplayBottom } from '../DisplayBottom';

import { mockAllOrNothingDialog } from './AllOrNothingDialog';

import { mockCardWithHighlightState } from '@game-common/card/CardWithHighlightState';
import { mockSwitchOut } from '@game-common/card/SwitchOut';
import { mockCardRowActiveCard } from '@game-components/CardRowActiveCard';
import { mockLocalPlayerBoosterButton } from '@game-components/LocalPlayerBoosterButton';
import { GameCard } from '@game-story-helpers';

interface MockProps {
  appliedBoosterIds?: number[];
  boosterId?: number;
  cardId?: string;
  playerId: string;
  loading?: boolean;
  cardData?: Partial<GameCard>;
}

export const mockLocalPlayerDisplay = ({
  appliedBoosterIds,
  boosterId,
  cardId,
  playerId,
  loading,
  cardData,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(cardId ? mockCardWithHighlightState({ cardId }) : []),
  ...(cardId ? mockAllOrNothingDialog({ cardId }) : []),
  ...mockCardRowActiveCard({ cardId, appliedBoosterIds, boosterId, playerId, cardData }),
  ...mockLocalPlayerBoosterButton({ playerId, boosterId }),
  ...mockSwitchOut({ cardId }),
  ...mockDisplayBottom({ playerId, loading }),
];
