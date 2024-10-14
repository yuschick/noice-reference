import classNames from 'classnames';
import { ReactNode } from 'react';

import styles from './CardRow.module.css';
import { LocalPlayerDisplay } from './LocalPlayerDisplay';
import { TeamMateDisplay } from './TeamMateDisplay';

import { SwitchOut } from '@game-common/card';
import { ChallengesButton } from '@game-common/challenges';
import { CardRowTeamInfoSm } from '@game-common/team';
import { LocalPlayerBoosterButton } from '@game-components/LocalPlayerBoosterButton';
import { useCardGameUIState } from '@game-context';
import { usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { useTeamMates } from '@game-logic/group/hooks';

export interface Props {
  slots?: {
    cardContainerSmAction: ReactNode;
  };
}

export function CardRow({ slots }: Props) {
  const { teamPlayerIds } = useTeamMates();
  const { applyModeActive } = usePlayerBoosterApply();
  const { isChallengesDialogOpen } = useCardGameUIState();

  return (
    <div
      className={classNames(styles.cardRowRoot, {
        [styles.applyBoosterMode]: applyModeActive,
        [styles.hideCardRow]: isChallengesDialogOpen,
      })}
      hidden={isChallengesDialogOpen}
    >
      <div className={styles.cardRowPlayersAndCards}>
        <LocalPlayerDisplay
          className={classNames(styles.cardRowItem, styles.cardRowLocalPlayer)}
        />

        {!!teamPlayerIds.length && (
          <>
            {teamPlayerIds.map((playerId, index) => (
              <TeamMateDisplay
                className={classNames(styles.cardRowItem, {
                  [styles[`cardRowTeamMate${index + 1}`]]: true,
                })}
                key={playerId}
                playerId={playerId}
              />
            ))}
          </>
        )}
      </div>

      <div className={styles.cardRowActions}>
        <ChallengesButton animationVfx="minimal" />
        <LocalPlayerBoosterButton />
        <SwitchOut preventTooltip />
        <CardRowTeamInfoSm className={styles.cardRowTeamInfo} />
        {slots?.cardContainerSmAction ? slots.cardContainerSmAction : null}
      </div>
    </div>
  );
}
