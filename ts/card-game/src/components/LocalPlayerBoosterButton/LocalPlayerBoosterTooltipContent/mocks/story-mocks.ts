import { StoryHelpers } from '@noice-com/common-ui';

import { LocalPlayerBoosterTooltipContentDocument } from '@game-gen';
import { getNewBooster } from '@game-story-helpers';

export const mockLocalPlayerBoosterTooltipContent = (
  boosterId: number,
  repeatMockResponse?: boolean,
) =>
  StoryHelpers.Apollo.createMock(
    LocalPlayerBoosterTooltipContentDocument,
    { boosterId },
    {
      booster: {
        ...getNewBooster(),
        id: boosterId,
      },
    },
    repeatMockResponse,
  );
