import { StoryHelpers } from '@noice-com/common-ui';

import { TeamMateBoosterDialogContentDocument } from '@game-gen';
import { getNewBooster } from '@game-story-helpers';

export const mockTeamMateBoosterDialogContent = (
  userId: string,
  boosterId: number,
  repeatMockResponse?: boolean,
) =>
  StoryHelpers.Apollo.createMock(
    TeamMateBoosterDialogContentDocument,
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
