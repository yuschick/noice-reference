import { StoryHelpers } from '@noice-com/common-ui';

import { mockAllOrNothing as mockAllOrNothingFunc } from './mocks/story-mocks';

import { mockCardWithHighlightState } from '@game-common/card';

interface Props {
  cardId: string;
}

export const mockAllOrNothingDialog = ({
  cardId,
}: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  mockAllOrNothingFunc(cardId),
  ...mockCardWithHighlightState({ cardId }),
];
