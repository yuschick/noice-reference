import { StoryHelpers } from '@noice-com/common-ui';

import { mockSwitchOutCardDetails } from './mocks/story-mocks';

interface MockProps {
  cardId?: string;
}

export const mockSwitchOut = ({ cardId }: MockProps): StoryHelpers.Apollo.GraphqlMock[] =>
  cardId ? [mockSwitchOutCardDetails(cardId)] : [];
