import { Leaderboard as LeaderboardComponent } from '@noice-com/card-game';
import { Switch } from '@noice-com/common-ui';
import { useState } from 'react';

import styles from './Leaderboard.module.css';

export function Leaderboard() {
  const [showAvatars, setShowAvatars] = useState(true);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leaderboardContainer}>
        <LeaderboardComponent variant={showAvatars ? 'scoreboard' : 'collapsed'} />
      </div>

      <div className={styles.footer}>
        <Switch
          checked={showAvatars}
          label="Show team members"
          onChange={(event) => setShowAvatars(event.target.checked)}
        />
      </div>
    </div>
  );
}
