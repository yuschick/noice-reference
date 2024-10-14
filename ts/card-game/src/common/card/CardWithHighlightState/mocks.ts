import { StoryHelpers } from '@noice-com/common-ui';

import { mockCardWithHighlightState as mockCardWithHighlightStateFunc } from './mocks/story-mocks';

import { mockGameCard } from '@game-card';

interface Props {
  cardId: string;
}

export const mockCardWithHighlightState = ({
  cardId,
}: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  mockCardWithHighlightStateFunc(cardId),
  ...mockGameCard(),
];
