import { StoryHelpers } from '@noice-com/common-ui';

import { ActiveBoostersDataDocument, ActiveBoostersProfileDataDocument } from '@game-gen';
import { getNewBooster } from '@game-story-helpers';

export const mockActiveBoostersData = (boosterId = 1) =>
  StoryHelpers.Apollo.createMock(
    ActiveBoostersDataDocument,
    { boosterId },
    {
      booster: {
        ...getNewBooster(),
        id: boosterId,
        timeActive: 10000,
      },
    },
  );

export const mockActiveBoostersProfileData = (userId: string) =>
  StoryHelpers.Apollo.createMock(
    ActiveBoostersProfileDataDocument,
    { userId },
    {
      profile: {
        __typename: 'ProfileProfile',
        ...StoryHelpers.getNewProfile(),
        userId,
      },
    },
  );
