import { StoryHelpers } from '@noice-com/common-ui';

import { ReplacementBoosterDataDocument } from '@game-gen';
import { getNewBooster } from '@game-story-helpers';

export const mockReplacementBoosterData = (boosterId: number) =>
  StoryHelpers.Apollo.createMock(
    ReplacementBoosterDataDocument,
    { id: boosterId },
    {
      booster: {
        ...getNewBooster(),
        id: boosterId,
      },
    },
    true,
  );
