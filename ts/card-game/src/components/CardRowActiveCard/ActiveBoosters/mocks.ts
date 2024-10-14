import { StoryHelpers } from '@noice-com/common-ui';

import { mockActiveBooster } from './ActiveBooster';
import { mockReplacementBoosterData } from './mocks/storybook-mocks';

interface MockProps {
  appliedBoosterIds?: number[];
  boosterId?: number;
  playerId: string;
}

export const mockActiveBoosters = ({
  appliedBoosterIds,
  boosterId,
  playerId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(boosterId ? [mockReplacementBoosterData(boosterId)] : []),
  ...(appliedBoosterIds
    ?.map((appliedBoosterId) =>
      mockActiveBooster({ boosterId: appliedBoosterId, playerId }),
    )
    .flat() ?? []),
];
