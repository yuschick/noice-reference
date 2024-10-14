import { useMountEffect } from '@noice-com/common-react-core';
import { Dialog, useAnalytics, useDialog } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { MatchEndRewards } from '../types';

import { BestPlays } from './BestPlays/BestPlays';
import styles from './MatchResultsDialog.module.css';
import { PlayerScores } from './PlayerScores/PlayerScores';
import { Rewards } from './Rewards/Rewards';

interface Props {
  matchEndMessage: MatchEndedMsg;
  rewards: MatchEndRewards;
  onClose(): void;
}

export function MatchResultsDialog({ matchEndMessage, rewards, onClose }: Props) {
  const store = useDialog({ title: 'Match results', onClose });
  const { trackEvent } = useAnalytics();

  useMountEffect(() => {
    store.actions.open();

    trackEvent({
      clientMatchEndResultsDialogShown: {},
    });
  });

  return (
    <Dialog store={store}>
      <Dialog.Header />
      <Dialog.Close />
      <Dialog.Content>
        <div className={styles.matchResultsDialogContentContainer}>
          <PlayerScores matchEndMessage={matchEndMessage} />
          <Rewards
            matchEndMessage={matchEndMessage}
            rewards={rewards}
          />
          <BestPlays matchEndMessage={matchEndMessage} />
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
