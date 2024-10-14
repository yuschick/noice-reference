import { StoryHelpers } from '@noice-com/common-ui';

import { mockCardsData } from './mocks/story-mocks';

interface Props {
  cardIds: string[];
}

export const mockCards = ({ cardIds }: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  mockCardsData(cardIds),
];
