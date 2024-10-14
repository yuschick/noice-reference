import { StoryHelpers } from '@noice-com/common-ui';

import { mockPlayerDisplay } from './PlayerDisplay';

import { GameCard } from '@game-story-helpers';

interface MockProps {
  cardId?: string;
  appliedBoosterIds?: number[];
  boosterId?: number;
  playerId: string;
  cardData?: Partial<GameCard>;
}

export const mockSpectatorCardRow = ({
  cardId,
  appliedBoosterIds,
  boosterId,
  playerId,
  cardData,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] =>
  mockPlayerDisplay({ playerId, appliedBoosterIds, boosterId, cardId, cardData });
