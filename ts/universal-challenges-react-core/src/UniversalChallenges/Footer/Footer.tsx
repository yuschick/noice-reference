import { CoreAssets } from '@noice-com/assets-core';
import { Countdown } from '@noice-com/common-ui';

import styles from './Footer.module.css';

export function Footer() {
  const targetDate = new Date(Date.now() + 240000);

  return (
    <div className={styles.universalChallengesFooterContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.headerText}>Challenges</h3>
        <span className={styles.basicText}>Choose your option and vote!</span>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.submissionDetailsContainer}>
          <span className={styles.basicText}>Submissions close in</span>
          <Countdown
            className={styles.fatText}
            minutesSuffix="min"
            secondsSuffix="sec"
            target={targetDate}
          />
        </div>
        <div className={styles.voteCountContainer}>
          <CoreAssets.Icons.ChannelCurrency />
          <span className={styles.fatText}>999999</span>
          <span className={styles.basicText}>in the pool</span>
        </div>
        <div className={styles.playerCountContainer}>
          <span className={styles.fatText}>750</span>
          <CoreAssets.Icons.User className={styles.userIcon} />
        </div>
      </div>
    </div>
  );
}
