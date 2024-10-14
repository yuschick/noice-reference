import { StoryHelpers } from '@noice-com/common-ui';

import { BoosterRequestPreviewProfileDocument } from '@game-gen';

export const mockBoosterRequestProfile = (userId: string, repeatMockResponse?: boolean) =>
  StoryHelpers.Apollo.createMock(
    BoosterRequestPreviewProfileDocument,
    { id: userId },
    {
      profile: {
        __typename: 'ProfileProfile',
        ...StoryHelpers.getNewProfile(),
        userId,
      },
    },
    repeatMockResponse,
  );
