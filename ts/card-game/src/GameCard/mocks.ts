import { StoryHelpers } from '@noice-com/common-ui';

import { mockGameCardBackroundArt } from './GameCardBackgroundArt';
import { mockGameCardLevel } from './GameCardLevel';

export const mockGameCard = (seasonId?: string): StoryHelpers.Apollo.GraphqlMock[] => [
  mockGameCardBackroundArt(seasonId),
  mockGameCardLevel(seasonId),
];
