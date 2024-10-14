import { StoryHelpers } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockChallengesDialog, MockChallengesDialogProps } from './ChallengesDialog';
import { mockMatchEnd } from './MatchEnd/mocks';
import { MockMatchViewProps, mockMatchView } from './MatchView';

type MockProps = MockMatchViewProps &
  MockChallengesDialogProps & { matchEndMessage: MatchEndedMsg };

export const mockCardGame = (props: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...mockChallengesDialog(props),
  ...mockMatchView(props),
  ...mockMatchEnd({ matchEndMessage: props.matchEndMessage }),
];
