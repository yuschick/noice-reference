import { InfoTooltip } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import styles from './ParticipationBonusTime.module.css';

interface Props {
  remainingDailyParticipationMinutes: Nullable<number>;
}

export function ParticipationBonusTime({ remainingDailyParticipationMinutes }: Props) {
  return (
    <section className={styles.wrapper}>
      <h3 className={styles.title}>Participation bonus</h3>

      <div className={styles.secondaryContentWrapper}>
        <span className={styles.resetsInWrapper}>
          <strong
            className={styles.resetsInLabel}
            role="timer"
          >
            {remainingDailyParticipationMinutes} min
          </strong>{' '}
          left today
        </span>

        <InfoTooltip label="Participation bonus">
          Awarded for participating in matches. Resets daily
        </InfoTooltip>
      </div>
    </section>
  );
}
