import { KeyboardKeys, useKeyPress, useToggle } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

import { BestPlays } from './BestPlays';
import styles from './CardRow.module.css';
import { LocalPlayerDisplay } from './LocalPlayerDisplay';
import { TeamMateDisplay } from './TeamMateDisplay';

import { AllOrNothingState, SwitchOut } from '@game-common/card';
import { ChallengesButton } from '@game-common/challenges';
import { CardRowTeamInfoLg } from '@game-common/team';
import { LocalPlayerBoosterButton } from '@game-components/LocalPlayerBoosterButton';
import { useCardGameUIState } from '@game-context';
import { useTeamMates } from '@game-logic/group/hooks';

export function CardRow() {
  const { teamPlayerIds } = useTeamMates();
  const [showBestPlays, , onOpenBestPlays, onCloseBestPlays] = useToggle(false);
  const [hideActions, setHideActions] = useState(false);
  const { isChallengesDialogOpen } = useCardGameUIState();

  const onAonStateChange = useCallback(
    (state: Nullable<AllOrNothingState>) => setHideActions(!!state),
    [],
  );

  useKeyPress(KeyboardKeys.Escape, onCloseBestPlays);

  if (showBestPlays) {
    return <BestPlays onClose={onCloseBestPlays} />;
  }

  return (
    <div
      className={classNames(styles.rowWrapper, {
        [styles.hideActions]: hideActions,
        [styles.hideCardRow]: isChallengesDialogOpen,
      })}
      hidden={isChallengesDialogOpen}
    >
      <div className={styles.cardRowActions}>
        <LocalPlayerBoosterButton />
        <SwitchOut />
        <ChallengesButton />
      </div>

      <LocalPlayerDisplay
        className={classNames(styles.rowItem, styles.localPlayer)}
        onAonStateChange={onAonStateChange}
      />

      {!!teamPlayerIds.length && (
        <>
          <div
            className={styles.handDivider}
            key="divider"
          />
          {teamPlayerIds.map((playerId, index) => (
            <TeamMateDisplay
              className={classNames(styles.rowItem, {
                [styles[`teamMate${index + 1}`]]: true,
              })}
              key={playerId}
              playerId={playerId}
            />
          ))}
        </>
      )}

      <div className={styles.handDivider} />
      <CardRowTeamInfoLg
        className={styles.rowItem}
        onOpenBestPlays={onOpenBestPlays}
      />
    </div>
  );
}
