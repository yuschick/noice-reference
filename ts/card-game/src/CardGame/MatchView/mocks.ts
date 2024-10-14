import { StoryHelpers } from '@noice-com/common-ui';

import { MockMatchViewLgProps, mockMatchViewLg } from './MatchViewLg';
import { MockMatchViewSmProps, mockMatchViewSm } from './MatchViewSm';

export type MockMatchViewProps = MockMatchViewLgProps & MockMatchViewSmProps;

export const mockMatchView = (
  props: MockMatchViewProps,
): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockMatchViewLg(props),
  ...mockMatchViewSm(props),
];
