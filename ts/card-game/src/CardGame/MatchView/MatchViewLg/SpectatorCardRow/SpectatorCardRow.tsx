import { PlayerDisplay } from './PlayerDisplay';
import styles from './SpectatorCardRow.module.css';

import { CardRowTeamInfoLg } from '@game-common/team';
import { useTeamMates } from '@game-logic/group/hooks';

export function SpectatorCardRow() {
  const { teamPlayerIds } = useTeamMates();

  return (
    <div className={styles.rowWrapper}>
      {!!teamPlayerIds.length &&
        teamPlayerIds.map((playerId) => (
          <PlayerDisplay
            className={styles.rowItem}
            key={playerId}
            playerId={playerId}
          />
        ))}

      <div className={styles.handDivider} />
      <CardRowTeamInfoLg
        className={styles.rowItem}
        isStatic
      />
    </div>
  );
}
