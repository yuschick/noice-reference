import { StoryHelpers } from '@noice-com/common-ui';

import { LocalPlayerBoosterDialogContentDocument } from '@game-gen';
import { getNewBooster } from '@game-story-helpers';

export const mockLocalPlayerBoosterDialogContent = (
  boosterId: number,
  repeatMockResponse?: boolean,
) =>
  StoryHelpers.Apollo.createMock(
    LocalPlayerBoosterDialogContentDocument,
    { boosterId },
    {
      booster: {
        ...getNewBooster(),
        id: boosterId,
      },
    },
    repeatMockResponse,
  );
