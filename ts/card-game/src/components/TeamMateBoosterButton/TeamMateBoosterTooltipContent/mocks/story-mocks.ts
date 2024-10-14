import { StoryHelpers } from '@noice-com/common-ui';

import { TeamMateBoosterTooltipContentDocument } from '@game-gen';
import { getNewBooster } from '@game-story-helpers';

export const mockTeamMateBoosterTooltipContent = (
  userId: string,
  boosterId: number,
  repeatMockResponse?: boolean,
) =>
  StoryHelpers.Apollo.createMock(
    TeamMateBoosterTooltipContentDocument,
    { userId, boosterId },
    {
      booster: {
        ...getNewBooster(),
        id: boosterId,
      },
      profile: {
        __typename: 'ProfileProfile',
        ...StoryHelpers.getNewProfile(),
        userId,
      },
    },
    repeatMockResponse,
  );
