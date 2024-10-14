import { StoryHelpers } from '@noice-com/common-ui';

import { mockLocalPlayerDisplay } from './LocalPlayerDisplay';
import { mockTeamMateDisplay } from './TeamMateDisplay';

import { GameCard } from '@game-story-helpers';

export interface MockCardRowProps {
  cardId?: string;
  appliedBoosterIds?: number[];
  boosterId?: number;
  playerId: string;
  isLocalPlayer?: boolean;
  cardData?: Partial<GameCard>;
}

export const mockCardRow = ({
  cardId,
  appliedBoosterIds,
  boosterId,
  playerId,
  isLocalPlayer,
  cardData,
}: MockCardRowProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(isLocalPlayer
    ? mockLocalPlayerDisplay({ playerId, appliedBoosterIds, boosterId, cardId, cardData })
    : []),
  ...(!isLocalPlayer
    ? mockTeamMateDisplay({ playerId, appliedBoosterIds, boosterId, cardId, cardData })
    : []),
];
