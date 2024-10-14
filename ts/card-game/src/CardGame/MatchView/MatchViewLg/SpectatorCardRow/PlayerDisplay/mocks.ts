import { StoryHelpers } from '@noice-com/common-ui';

import { getPlayerDisplayMock } from '../mocks/story-mocks';
import { mockSpectatorDisplayBottom } from '../SpectatorDisplayBottom';

import { mockCardRowActiveCard } from '@game-components/CardRowActiveCard';
import { mockCardRowAvatar } from '@game-components/CardRowAvatar';
import { mockTeamMateBoosterButton } from '@game-components/TeamMateBoosterButton';
import { GameCard } from '@game-story-helpers';

interface MockProps {
  appliedBoosterIds?: number[];
  boosterId?: number;
  cardId?: string;
  playerId: string;
  cardData?: Partial<GameCard>;
}

export const mockPlayerDisplay = ({
  appliedBoosterIds,
  boosterId,
  playerId,
  cardId,
  cardData,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockCardRowActiveCard({ cardId, appliedBoosterIds, boosterId, playerId, cardData }),
  ...mockTeamMateBoosterButton({ playerId, boosterId }),
  ...mockCardRowAvatar({ playerId }),
  ...mockSpectatorDisplayBottom({ playerId }),
  getPlayerDisplayMock(playerId),
];
