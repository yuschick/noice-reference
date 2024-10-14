import { StoryHelpers } from '@noice-com/common-ui';

import { mockTeamMateBoosterDialogContent } from './TeamMateBoosterDialogContent';
import { mockTeamMateBoosterTooltipContent } from './TeamMateBoosterTooltipContent';

interface MockProps {
  playerId: string;
  boosterId?: number;
}

export const mockTeamMateBoosterButton = ({
  playerId,
  boosterId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] =>
  boosterId
    ? [
        ...mockTeamMateBoosterTooltipContent({
          playerId,
          boosterId,
          repeatMockResponse: true,
        }),
        ...mockTeamMateBoosterDialogContent({
          playerId,
          boosterId,
          repeatMockResponse: true,
        }),
      ]
    : [];
