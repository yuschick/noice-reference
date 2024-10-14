import { HorizontalProgressBar } from '@noice-com/common-ui';

import { CurrencyAmounts } from '../CurrencyAmounts/CurrencyAmounts';

import styles from './Challenge.module.css';
import { VoteCounts } from './VoteCounts/VoteCounts';
import { Voting } from './Voting/Voting';

export function Challenge() {
  return (
    <div className={styles.universalChallengeContainer}>
      <div className={styles.challengeInfoContainer}>
        <div className={styles.challengeHeaderContainer}>
          <VoteCounts />
          <CurrencyAmounts />
        </div>

        <HorizontalProgressBar
          className={styles.progressbar}
          max={1}
          min={0}
          progress={0.3}
          title="Vote distribution"
        />

        <span className={styles.descriptionText}>
          Long description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
          laoreet pellentesque porta. 45760dkfiejnc dntoksnt
        </span>
      </div>

      <Voting />
    </div>
  );
}
