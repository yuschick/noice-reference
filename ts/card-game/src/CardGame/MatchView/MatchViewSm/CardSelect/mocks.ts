import { StoryHelpers } from '@noice-com/common-ui';

import { mockCards } from './Cards';

interface Props {
  cardIds: string[];
}

export const mockCardSelect = ({ cardIds }: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockCards({ cardIds }),
];
