import { StoryHelpers } from '@noice-com/common-ui';

import { mockLocalPlayerBoosterDialogContent } from './LocalPlayerBoosterDialogContent';
import { mockLocalPlayerBoosterTooltipContent } from './LocalPlayerBoosterTooltipContent';
import { mockRequestPreview } from './RequestPreview';

interface MockProps {
  playerId: string;
  boosterId?: number;
}

export const mockLocalPlayerBoosterButton = ({
  playerId,
  boosterId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] =>
  boosterId
    ? [
        ...mockRequestPreview({ userId: playerId }),
        ...mockLocalPlayerBoosterTooltipContent({ boosterId, repeatMockResponse: true }),
        ...mockLocalPlayerBoosterDialogContent({ boosterId, repeatMockResponse: true }),
      ]
    : [];
