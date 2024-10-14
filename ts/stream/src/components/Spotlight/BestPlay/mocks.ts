import { mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';

export const mockBestPlay = (): StoryHelpers.Apollo.GraphqlMock[] => mockGameCard();
